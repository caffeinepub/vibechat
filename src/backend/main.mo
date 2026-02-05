import Principal "mo:core/Principal";

actor {
  public query ({ caller }) func checkCanisterStatus() : async Principal {
    caller;
  };
};
