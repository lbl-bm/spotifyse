import { useState } from "react";
import {
  useSessionContext,
  useUser as useSupabaseUser,
} from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect } from "react";
import { UserDetails, Subscription } from "@/types";

type UserContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupabaseUser();
  const accessToken = session?.access_token ?? null;
  const refreshToken = session?.refresh_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const getUserDetails = async (): Promise<UserDetails | null> => {
    const { data, error } = await supabase.from("users").select("*").single();
    if (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
    return data;
  };
  
  const getSubscription = async (): Promise<Subscription | null> => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();
    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
    return data;
  };
  
  useEffect(() => {
    if (user && !isLoadingUser && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === "fulfilled" && userDetailsPromise.value) {
            setUserDetails(userDetailsPromise.value);
          }
          if (subscriptionPromise.status === "fulfilled" && subscriptionPromise.value) {
            setSubscription(subscriptionPromise.value);
          }

          setIsLoadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    refreshToken,
    user: userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};