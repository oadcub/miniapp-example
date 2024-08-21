"use client";
import initAuth from "@/jsBridge/initAuth";
import Image from "next/image";
import router from "next/router";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';

type status = {
  status: string;
  errorCode?: string;
  errorDesc?: string;
  isLoaded: boolean;
};
export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<status>({
    status: "starting to init auth...",
    isLoaded: true,
  });


  const getTokenForPayment = async () => {
    console.log('start getTokenForPayment');
    const url = 'https://oapi-2-legged-gw-uat.arisetech.dev/oauth/authentication/api/v2/token';
  
    const data = new URLSearchParams();
    data.append('client_id', "8b927d53-dfa1-4b4c-8c74-46835598a152");
    data.append('client_secret', "4a241b24-09fa-442b-9a25-3ffbd1b1f789");
  
    try {
      const response = await axios.post(url, data.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      console.log('getTokenForPayment',response.data);


      const tokenn = response.data;
      createPaymentDeeplink(tokenn.access_token);

      return response.data;
    } catch (error) {
      console.error('Error fetching token', error);
      throw error;  // Re-throw the error after logging it
    }
  };


  const createPaymentDeeplink = async (tttookken:string) => {
    const url = 'https://oapi-2-legged-gw-sit.arisetech.dev/oapi/payment/deeplink';
    const accessToken = tttookken; // Replace with your actual access token
  
    const data = {
      "partnerTxnCreatedDt": "2024-02-17T05:23:45+0700",
      "paymentInfo": {
        "billerId": "58091",
        "paymentMethod": "KTB-PT",
        "partnerTxnRef": "abc",
        "amount": 100.10,
        "ref1value": "affe2ead-33c5-4056-a790-82d72358a9a9"
      },
      "partnerInfo": {
        "deeplink": "https://partner.url.com/paymentResult?ref=abc&destination=miniapp&miniAppUUID={miniAppUUID}"
      }
    };
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      console.log('createPaymentDeeplink response',response.data);
    } catch (error) {
      console.error('Error creating payment deeplink', error);
    }
  };

  const handleClick = () => {
    initAuth(
      //callback function for success
      async (authorizationCode: string) => {
        /*
          Logic to handle the authorization code received from the native app
          after successful authentication
        */

        //example
        setStatus({
          status: "init auth success 🎉",
          isLoaded: false,
        });
        console.log("[initAuth] success 🎉");
        console.log("[initAuth] authCode", authorizationCode);
        router.replace(`/?authCode=${authorizationCode}`);





        const hostname = 'https://paotang-id-external-uat.th-service.co.in';
        const url = `${hostname}/oauth2/token`;
      
        const data = new URLSearchParams();
        data.append('code', authorizationCode);
        data.append('grant_type', 'authorization_code');
        data.append('redirect_uri', 'https://8685-202-80-231-28.ngrok-free.app');
        data.append('client_id', 'b6fb5cc9-67ba-4cf0-a8ab-89c096ec400e');
        data.append('client_secret', 'X5j5mA6uqxV1zONVgrENMAggVbp6GD');
      
        try {
          console.log("axios");
          const response = await axios.post(url, data.toString(), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          console.log('token',response.data.access_token);
          const token = response.data;



          const hostnameOpai = 'https://paotang-openapi-sandbox-uat.th-service.co.in';
          const urlOapi = `${hostnameOpai}/v1/paotangid/get-customer-profile-sandbox`;
          try {
            const response = await axios.post(
              `${urlOapi}`,
              {}, // Empty body for the POST request
              {
                headers: {
                  'Authorization': 'Bearer '+token.access_token,
                },
              }
            );
        
            console.log(response.data);

          } catch (error) {
            console.error('Error fetching customer profile', error);
          }
  
  



        } catch (error) {
          console.error('Error during token request', error);
        }








      },
      //callback function for error
      (errorCode, errorDescription) => {
        /*
          Logic to handle the error received from the native app 
          after failed authentication
        */

        //example
        setStatus({
          status: "init auth failed 😢",
          errorCode: errorCode,
          errorDesc: errorDescription,
          isLoaded: false,
        });
        console.log("[initAuth] failed 😢");
        console.log("[initAuth] error:", errorCode, errorDescription);
      }
    );
  };

  const callPtPass = () => {

  }





  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <Image
        src={"/assets/logo/mini-app-logo.svg"}
        className="logo mini-app"
        width={96}
        height={96}
        alt="Mini App logo"
      />

      <div className="flex flex-col justify-center items-center pt-14">
        <h1 className="text-3xl font-semibold">Welcome to Mini App 666</h1>
        <button onClick={handleClick}>auth</button>
        <button onClick={getTokenForPayment}>call payment</button>
      </div>
    </div>
  );
}
