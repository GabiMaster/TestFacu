import imagePath from '@/src/constants/imagePath';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';


const Auth = () => {
    const [isLoding, setIsLoading] = useState(false);

    let navigateToLoginPage = () => {
        router.push('/(auth)/login_page');
    }

    let loadingTimeout = () => {
        setIsLoading(true);
        setTimeout(navigateToLoginPage, 2000); // Simulate loading for 2 seconds
    };

    useEffect(() => {
        setTimeout(loadingTimeout, 2000); // Simulate loading for 2 seconds
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}></View>
            <View style={styles.body}>
                <Image source={imagePath.logo} style={styles.logoStyle} resizeMode='contain'/>
                <Text style={styles.codeFarmText}>Code Farm</Text>
            </View>
            <View style={styles.footer}>
                {isLoding ? (
                    <>
                        <ActivityIndicator size={moderateScale(48)} color={'#ffffff'}/>
                        <Text style={styles.tikTakText}>Loading...</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.tikTakText}>TIKTAK.INC</Text>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161622',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: moderateScale(70),
    },
    header: {
    },
    body: {
        alignItems: 'center',
    },
    footer: {
        alignItems: 'center',
        height: verticalScale(70),
        justifyContent: 'flex-end',
        paddingBottom: 20,
        paddingTop: 10,
    },
    logoStyle: {
        width: moderateScale(222),
        height: moderateScale(222),
        marginBottom: 20,
    },
    codeFarmText: {
        color: '#ffffff',
        fontSize: moderateScale(24),
    },
    tikTakText: {
        color: '#ffffff',
        fontSize: moderateScale(16),
    },
})

export default Auth;