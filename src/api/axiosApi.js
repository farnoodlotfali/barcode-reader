import { PagesUrls } from "@/constants/PagesUrl";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

let tryCount = 0;
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const apiCode = process.env.NEXT_PUBLIC_API_CODE;

// controlled
const client = axios.create({
  baseURL: baseURL,
  headers: {
    apiCode: apiCode,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// controlled
export const simpleAxiosApi = ({ ...options }) => {
  const onSuccess = (response) => response;
  const onError = (error) => {
    console.log(error);
    // optionaly catch errors and add additional logging here
    return error;
  };

  return client(options).then(onSuccess);
};

// controlled
export const axiosApi = ({ ...options }, showError = true) => {
  if (!Cookies.get("token")) {
    window.location.href = PagesUrls.Login;
  }

  client.defaults.headers.Authorization = Cookies.get("token");

  const onSuccess = (response) => response;
  const onError = (error) => {
    let e = error;
    let msg = e.response.data.Message;

    console.log(error);
    if (showError) {
      toast.error(msg ?? "خطا  ");
    }

    throw error;
  };

  return client(options).catch((e) => onError(e));
  // return client(options).then(onSuccess).catch(onError);
};

client.interceptors.response.use(
  (response) => {
    // console.log(response);

    return response;
  },
  async (error) => {
    // console.log(error.response);
    // const { logout } = useContext(authContext);
    // console.log(tryCount);
    // console.log(
    //   '**t***',
    //   error.config && error.response && error.response.status === 401,
    //   error,
    //   error.response.status,
    //   error.config
    // );
    //************************************** 5xx
    // if (error.response.status.toString().startsWith(5)) {
    //   // window.location.href = "/serverError";
    // }

    // ************************************** 404
    if (error.config && error.response && error.response.status === 404) {
      // window.location.replace("/not-found");
      return Promise.reject(error);
    }

    // ************************************** 500
    if (error.config && error.response && error.response.status === 500) {
      // window.location.replace("/server-error");
      // return Promise.reject(error);
    }

    // ************************************** 401
    if (error.config && error.response && error.response.status === 401) {
      Cookies.remove("token");
      window.location.href = PagesUrls.Login;
      // Cookies.remove("refreshToken");
      if (tryCount === 3) {
        // const res = JSON.parse(
        //   localStorage.getItem("logForRefreshTokenExpired")
        // );
        // if (!res) {
        //   localStorage.clear();
        //   window.location = "/login";
        //   localStorage.setItem("logForRefreshTokenExpired", true);
        // }

        return Promise.reject(error);
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const form = { refresh: localStorage.getItem("refreshToken") };

      tryCount++;
      // return mainApi.post("/token/refresh/", form, config).then((response) => {
      //   // if (response.status === 200 || response.status === 201) {
      //   //   localStorage.setItem("tokenAccess", response.data.access);
      //   //   error.config.headers.Authorization = "Bearer " + response.data.access;
      //   //   return mainApi.request(error.config);
      //   // }
      // });
      // .catch((error) => {
      //   if (error.response && error.response.status === 401) {
      //     // localStorage.clear();
      //     // window.location = '/login';
      //     console.log(tryCount);
      //   }
      //   return Promise.reject(error);
      // });
    }

    return Promise.reject(error);
  }
);
