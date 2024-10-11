import { defaultStyles } from '@/constants/Style';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;


const Phone = () => {
    const { phone, signin } = useLocalSearchParams<{ phone: string, signin: string }>()
    const [code, setcode] = useState('');
    const { signIn } = useSignIn();
    const { signUp, setActive } = useSignUp();


    const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setcode,
    });

    useEffect(() => {
        if (code.length === 6) {
            if (signin === "true") {
                verifySignIn();
            }
            else {
                verifyCode();
            }
        }
    }, [code])

    const verifyCode = async () => { };

    const verifySignIn = async () => { };


    return (
        <View style={defaultStyles.container}>
            <Text style={defaultStyles.header}>6-digit code</Text>
            <Text style={defaultStyles.descriptionText}>
                Code sent to {phone} unless you already have an account
            </Text>

            <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={code}
                onChangeText={setcode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
                testID="my-code-input"
                renderCell={({ index, symbol, isFocused }) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                )}
            />

            <Link href={'/login'} replace asChild>
                <TouchableOpacity>
                    <Text style={[defaultStyles.textLink]}>Already have an account? Log in</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
})

export default Phone;
