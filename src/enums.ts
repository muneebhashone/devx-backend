import { builder } from "./builder";

export const permissionEnums = [
  "VIEW_USER",
  "CREATE_USER",
  "EDIT_USER",
  "DELETE_USER",
  "VIEW_DASHBOARD",
  "VIEW_PERMISSIONS",
  "UPDATE_PERMISSIONS",
] as const;

export const notificationTypeEnums = [
  "LIKE",
  "COMMENT",
  "BOOKMARK",
  "FOLLOW",
  "MESSAGE",
] as const;

export const rolesEnums = [
 "ADMIN", "DEFAULT"
] as const;

export const groupRolesEnums = ["ADMIN", "MODERATOR", "MEMBER"] as const; 

export const mediaTypeEnums = ["IMAGE", "VIDEO", "LINK"] as const;

export const statusEnums = ["REJECTED", "APPROVED", "REQUESTED"] as const;

export type RoleType = (typeof rolesEnums)[number];
export type GroupRoleType = (typeof groupRolesEnums)[number];
export type StatusType = (typeof statusEnums)[number];
export type PermissionsType = (typeof permissionEnums)[number];
export type NotificationType = (typeof notificationTypeEnums)[number];
export type MediaType = (typeof mediaTypeEnums)[number];

export const StatusGraphQLEnum = builder.enumType("Status", {
  values: statusEnums,
});

export const MediaTypeGraphQLEnum = builder.enumType("MediaType", {
  values: mediaTypeEnums,
});

export const GroupRoleTypeGraphQLEnum = builder.enumType("GroupRoleType", {
  values: groupRolesEnums,
});

export const NotificationTypeGraphQLEnum = builder.enumType("NotificationType", {
  values: notificationTypeEnums,
});
