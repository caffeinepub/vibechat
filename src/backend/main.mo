import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Persistent User Data and Password State

  public type UserProfile = {
    fullName : Text;
    phoneNumber : Text;
    profilePicture : ?Storage.ExternalBlob;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let passwords = Map.empty<Principal, Text>();

  // Conversations & Messages Data Structures

  public type MediaAttachmentType = {
    #photo;
    #video;
  };

  public type MediaAttachment = {
    attachmentType : MediaAttachmentType;
    blob : Storage.ExternalBlob;
  };

  public type Message = {
    sender : Principal;
    text : Text;
    timestamp : Nat;
    attachments : [MediaAttachment];
  };

  public type Conversation = {
    participants : Set.Set<Principal>;
    messages : List.List<Message>;
  };

  let conversations = Map.empty<Text, Conversation>();

  // Profile Management Functions (with authorization checks)

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (not (await checkPhoneNumberAvailability(profile.phoneNumber))) {
      let existingProfile = userProfiles.get(caller);
      switch (existingProfile) {
        case (?existing) {
          if (not Text.equal(existing.phoneNumber, profile.phoneNumber)) {
            Runtime.trap("Phone number is already taken!");
          };
        };
        case (null) {
          Runtime.trap("Phone number is already taken!");
        };
      };
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfilePicture(user : Principal) : async ?Storage.ExternalBlob {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile picture");
    };
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) { profile.profilePicture };
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.values().toArray();
  };

  public query ({ caller }) func getAllVerifiedPhoneNumbers() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all phone numbers");
    };
    let phoneList = List.empty<Text>();
    let phoneNumbers = userProfiles.values().toArray().map(func(user) { user.phoneNumber });
    for (num in phoneNumbers.values()) {
      phoneList.add(num);
    };
    phoneList.toArray();
  };

  public query ({ caller }) func checkPhoneNumberAvailability(phoneNumber : Text) : async Bool {
    // No authorization check - accessible to all including guests for registration
    let alreadyExists = userProfiles.values().any(
      func(profile) {
        Text.equal(profile.phoneNumber, phoneNumber);
      }
    );
    not alreadyExists;
  };

  public shared ({ caller }) func uploadProfilePicture(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload profile pictures");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    let newProfile = { profile with profilePicture = ?blob };
    userProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func registerUserProfile(profile : UserProfile) : async () {
    // No authorization check - accessible to all including guests for initial registration
    if (not (await checkPhoneNumberAvailability(profile.phoneNumber))) {
      Runtime.trap("Phone number is already taken!");
    };
    userProfiles.add(caller, profile);
  };

  // Password Management Functions

  public shared ({ caller }) func setPassword(password : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set passwords");
    };
    passwords.add(caller, password);
  };

  public shared ({ caller }) func checkPassword(password : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check passwords");
    };
    switch (passwords.get(caller)) {
      case (null) { false };
      case (?pw) { pw == password };
    };
  };

  public shared ({ caller }) func changePassword(oldPassword : Text, newPassword : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can change passwords");
    };
    let currentPassword = switch (passwords.get(caller)) {
      case (?pw) { pw };
      case (null) { Runtime.trap("Password not set") };
    };
    if (currentPassword != oldPassword) {
      Runtime.trap("Incorrect old password");
    };
    passwords.add(caller, newPassword);
  };

  public query ({ caller }) func hasPassword() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check password existence");
    };
    passwords.containsKey(caller);
  };

  public shared ({ caller }) func removePassword() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove passwords");
    };
    passwords.remove(caller);
  };

  // Contact Matching Function

  public query ({ caller }) func getMatchingContacts(phoneNumbers : [Text]) : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: only users can match contacts");
    };

    let matchingProfiles = List.empty<UserProfile>();

    for (phoneNumber in phoneNumbers.values()) {
      for (profile in userProfiles.values()) {
        if (profile.phoneNumber == phoneNumber) {
          matchingProfiles.add(profile);
        };
      };
    };

    matchingProfiles.toArray();
  };

  // Conversation & Messaging Backend

  // Create Conversation - Returns conversation ID
  public shared ({ caller }) func createConversation(participants : [Principal]) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create conversations");
    };

    if (participants.size() < 2) {
      Runtime.trap("A conversation requires at least two participants");
    };

    let uniqueParticipants = Set.empty<Principal>();
    for (p in participants.values()) {
      uniqueParticipants.add(p);
    };

    uniqueParticipants.add(caller); // Include creator in participants

    let conversationId = "conv_" # uniqueParticipants.values().toArray().toText();

    let newConversation : Conversation = {
      participants = uniqueParticipants;
      messages = List.empty<Message>();
    };

    conversations.add(conversationId, newConversation);
    conversationId;
  };

  // Send Message (with optional attachments)
  public shared ({ caller }) func sendMessage(conversationId : Text, message : Message) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let conversation = switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?c) { c };
    };

    if (not isParticipant(conversation, caller)) {
      Runtime.trap("Unauthorized: You are not a participant of this conversation");
    };

    let newMessage : Message = {
      sender = caller;
      text = message.text;
      timestamp = message.timestamp;
      attachments = message.attachments;
    };

    conversation.messages.add(newMessage);
  };

  // Get Conversation Messages
  public query ({ caller }) func getMessages(conversationId : Text) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read messages");
    };

    let conversation = switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?c) { c };
    };

    if (not isParticipant(conversation, caller)) {
      Runtime.trap("Unauthorized: You are not a participant of this conversation");
    };

    conversation.messages.toArray();
  };

  // Helper function to check participant status
  func isParticipant(conversation : Conversation, principal : Principal) : Bool {
    conversation.participants.contains(principal);
  };

  // Get User's Conversation List
  public query ({ caller }) func getUserConversations() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    let conversationIds = List.empty<Text>();
    for ((id, conversation) in conversations.entries()) {
      if (isParticipant(conversation, caller)) {
        conversationIds.add(id);
      };
    };
    conversationIds.toArray();
  };
};
