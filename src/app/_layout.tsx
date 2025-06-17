import { Redirect, SplashScreen, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <>
      <Stack screenOptions={{ headerShown: false}} />
      {isLogin ? <Redirect href={"/(main)"} /> : <Redirect href={"/(auth)"} />}
    </>
  );
};

export default RootNavigation;