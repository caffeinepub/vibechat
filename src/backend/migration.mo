import Set "mo:core/Set";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  // Old Type Definitions (passwords and userProfiles)
  type OldActor = {
    userProfiles : Map.Map<Principal, {
      fullName : Text;
      phoneNumber : Text;
      profilePicture : ?Storage.ExternalBlob;
    }>;
    passwords : Map.Map<Principal, Text>;
  };

  // New Type Definitions (includes conversations & messages)

  type MediaAttachment = {
    attachmentType : {
      #photo;
      #video;
    };
    blob : Storage.ExternalBlob;
  };

  type Message = {
    sender : Principal;
    text : Text;
    timestamp : Nat;
    attachments : [MediaAttachment];
  };

  type Conversation = {
    participants : Set.Set<Principal>;
    messages : List.List<Message>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, {
      fullName : Text;
      phoneNumber : Text;
      profilePicture : ?Storage.ExternalBlob;
    }>;
    passwords : Map.Map<Principal, Text>;
    conversations : Map.Map<Text, Conversation>;
  };

  // Migration Function
  public func run(old : OldActor) : NewActor {
    {
      old with
      conversations = Map.empty<Text, Conversation>() // Initialize empty conversations
    };
  };
};
