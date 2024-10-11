import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Style";
import { useSignUp } from "@clerk/clerk-expo";
import { Link,useRouter } from "expo-router";
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
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { TextInput } from 'react-native-gesture-handler';

const Page = () => {
  const [countrycode, setcountrycode] = useState("+91");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset=Platform.OS=='android'?90:0
  const router=useRouter();
  const {signUp}=useSignUp()
  
  const onSignup = async () => {
    const fullphoneNumber =`${countrycode} ${PhoneNumber}`
    // router.push({pathname:"./verify/[Phone]",params:{phone:fullphoneNumber}})
    try{
      await signUp!.create({
        phoneNumber:fullphoneNumber
      })
      router.push({pathname:"./verify/[Phone]",params:{phone:fullphoneNumber}})
    }
    catch(error){
      console.error("Error singinup:", error)
    }
  };
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior="padding" keyboardVerticalOffset={80}>
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
      <Link href={"/login"} replace asChild>
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Link>

      <View style={{flex:1}} ></View>
      
      <TouchableOpacity style={[defaultStyles.pillButton,
        PhoneNumber!=""?styles.enabled:styles.disabled]}onPress={onSignup}>
        <Text style={defaultStyles.buttonText}>Sign Up</Text>
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
  enabled:{
    backgroundColor:Colors.primary
},
disabled:{
    backgroundColor:Colors.primaryMuted
    
  }
});

export default Page;
