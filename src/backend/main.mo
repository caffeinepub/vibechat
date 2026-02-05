import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  public type UserProfile = {
    fullName : Text;
    phoneNumber : Text;
    profilePicture : ?Storage.ExternalBlob;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let passwords = Map.empty<Principal, Text>();

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
};
