import { Redirect, Stack } from 'expo-router';
import React, { useState } from 'react';

const RootNavigation = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      <Stack screenOptions={{ headerShown: false}}></Stack>
      {isLogin ? <Redirect href="/(main)" /> : <Redirect href="/(auth)" />}
    </>
  );
};

export default RootNavigation;