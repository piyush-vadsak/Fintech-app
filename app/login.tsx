import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Style";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

enum SignInType {
  Phone,
  email,
  Google,
  Apple,
}

const Page = () => {
  const [countrycode, setcountrycode] = useState("+91");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS == "android" ? 90 : 0;
  const route=useRouter();
  const {signIn}=useSignIn();
  
  const onSignIn = async (type: SignInType) => {
    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countrycode}${PhoneNumber}`;

        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });

        // Check if supportedFirstFactors exists and is an array
        if (Array.isArray(supportedFirstFactors) && supportedFirstFactors.length > 0) {
          const firstPhoneFactor = supportedFirstFactors.find((factor: any) => {
            return factor.strategy === "phone_code";
          });

          if (firstPhoneFactor) {
            const { phoneNumberId } = firstPhoneFactor;

            await signIn!.prepareFirstFactor({
              strategy: "phone_code",
              phoneNumberId,
            });

            route.push({
              pathname: "./verify/[Phone]",
              params: { phone: fullPhoneNumber, signin: "true" },
            });
          } else {
            console.error("No phone_code strategy found in supportedFirstFactors.");
          }
        } else {
          console.error("supportedFirstFactors is not available or empty.");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={80}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            //   placeholder="Country code"
            placeholderTextColor={Colors.gray}
            onChangeText={setcountrycode}
            value={countrycode}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile number"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={PhoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* <View style={{flex:1}} ></View> */}

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            PhoneNumber != "" ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={() => onSignIn(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          ></View>
          <Text>or</Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          ></View>
        </View>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              backgroundColor: "white",
              flexDirection: "row",
              marginVertical: 20,
              gap: 16,
            },
          ]}
          onPress={()=>onSignIn(SignInType.email)}
        >
          <Ionicons name="mail" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: "black" }]}>
            Continue with email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              backgroundColor: "white",
              flexDirection: "row",
              marginBottom: 20,
              gap: 16,
            },
          ]}
          onPress={()=>onSignIn(SignInType.Google)}
        >
          <Ionicons name="logo-google" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: "black" }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              backgroundColor: "white",
              flexDirection: "row",
              marginBottom: 20,
              gap: 16,
            },
          ]}
          onPress={()=>onSignIn(SignInType.Apple)}
        >
          <Ionicons name="logo-apple" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: "black" }]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    marginRight: 10,
    fontSize: 20,
    borderRadius: 16,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});

export default Page;
