
const AuthGuard = {

    getAuth() {
          let isAuth=sessionStorage.getItem('isAuthorized');
          return isAuth;
      }
}

export default AuthGuard
