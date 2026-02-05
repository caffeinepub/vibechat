import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Message {
    text: string;
    sender: Principal;
    timestamp: bigint;
    attachments: Array<MediaAttachment>;
}
export interface MediaAttachment {
    blob: ExternalBlob;
    attachmentType: MediaAttachmentType;
}
export interface UserProfile {
    fullName: string;
    phoneNumber: string;
    profilePicture?: ExternalBlob;
}
export enum MediaAttachmentType {
    video = "video",
    photo = "photo"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changePassword(oldPassword: string, newPassword: string): Promise<void>;
    checkPassword(password: string): Promise<boolean>;
    checkPhoneNumberAvailability(phoneNumber: string): Promise<boolean>;
    createConversation(participants: Array<Principal>): Promise<string>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getAllVerifiedPhoneNumbers(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMatchingContacts(phoneNumbers: Array<string>): Promise<Array<UserProfile>>;
    getMessages(conversationId: string): Promise<Array<Message>>;
    getProfilePicture(user: Principal): Promise<ExternalBlob | null>;
    getUserConversations(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasPassword(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    registerUserProfile(profile: UserProfile): Promise<void>;
    removePassword(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(conversationId: string, message: Message): Promise<void>;
    setPassword(password: string): Promise<void>;
    uploadProfilePicture(blob: ExternalBlob): Promise<void>;
}
