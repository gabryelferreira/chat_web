// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    login: "http://localhost:8080/login",
    criarConta: "http://localhost:8080/users",
    refreshToken: "http://localhost:8080/refresh-token",
    
    allRooms: "http://localhost:8080/rooms",
    roomMessages: "http://localhost:8080/rooms/{uuid}/messages",
    readRoomMessages: "http://localhost:8080/rooms/{uuid}/read",
    socketConnection: "http://localhost:8080",
    findUsersByEmail: "http://localhost:8080/users?email={email}",
    privateRoomByUserUUID: "http://localhost:8080/rooms/privates/by-user/{uuid}",
    createGroup: "http://localhost:8080/rooms/groups",
    signedUrl: "http://localhost:8080/signed-url",
    updateAvatar: "http://localhost:8080/users/avatar",
    updateUserInfo: "http://localhost:8080/users",
    getMyUserData: "http://localhost:8080/users/me",
  },
  debugApiResponse: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
