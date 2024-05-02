import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
} from "react-native";
import * as Linking from "expo-linking";

async function fetchAPI() {
  const res = await fetch(
    "https://5012991e-8251-4261-94ef-3d5e276f1ee8-00-p5y7v5bisibe.spock.replit.dev/docs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
}

async function login(email, password) {
  console.log(email, password);
  fetch(
    "https://5012991e-8251-4261-94ef-3d5e276f1ee8-00-p5y7v5bisibe.spock.replit.dev/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  )
    .then((r) => r.json())
    .then((r) => {
      if (r.status === "ok") {
        setIsAuthorized(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        alert("Invalid email or password");
      }
    });
}

export default function App() {
  const [docs, setDocs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function getDocs() {
    fetchAPI()
      .then((r) => r.json())
      .then((r) => {
        setDocs(r.docs);
        setIsLoading(false);
        getDocs();
      });
  }

  const item = ({ item }) => (
    <>
      <View
        style={{
          flexDirection: "row",
          color: "#f0f0f0",
          backgroundColor: "#3b82f6",
          borderTopLeftRadius: item.top ? 7 : 0,
          borderTopRightRadius: item.top ? 7 : 0,
          borderBottomLeftRadius: item.bottom ? 7 : 0,
          borderBottomRightRadius: item.bottom ? 7 : 0,
          padding: 10,
          paddingBottom: item.bottom ? 50 : 10,
        }}
      >
        <View style={{ width: 190 }}>
          <Text
            style={{
              fontSize: typeof item.distance === "string" ? 17 : 16,
              fontWeight: typeof item.distance === "string" ? "bold" : "normal",
              color: "#f0f0f0",
            }}
          >
            {typeof item.distance === "string"
              ? `${item.hospital} & ${item.bedNumber}`
              : `${item.hospital} - bed #${item.bedNumber}`}
          </Text>
        </View>
        <View style={{ width: 95 }}>
          <Text
            style={{
              fontSize: typeof item.distance === "string" ? 17 : 16,
              fontWeight: typeof item.distance === "string" ? "bold" : "normal",
              color: "#f0f0f0",
              marginLeft: typeof item.distance === "string" ? 0 : 2,
            }}
          >
            {typeof item.distance === "string" ? (
              "Location"
            ) : (
              <>
                <Pressable
                  onPress={() => Linking.openURL(item.location)}
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#3b82f6",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: "#3b82f6",
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Start
                  </Text>
                </Pressable>
              </>
            )}
          </Text>
        </View>
        <View
          style={{
            width: 73,
            marginBottom: typeof item.distance === "string" ? 13 : 10,
          }}
        >
          <Text
            style={{
              fontSize: typeof item.distance === "string" ? 17 : 16,
              fontWeight: typeof item.distance === "string" ? "bold" : "normal",
              color: "#f0f0f0",
            }}
          >
            {typeof item.distance === "string"
              ? item.distance
              : `${item.distance}km`}
          </Text>
        </View>
      </View>
      {!item.bottom && (
        <View
          style={{ width: 380, height: 1, backgroundColor: "#f0f0f0" }}
        ></View>
      )}
    </>
  );

  const inputRef = useRef(null);
  const input2Ref = useRef(null);

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        if (
          isAuthorized ||
          isLoading ||
          !input2Ref.current ||
          !inputRef.current
        )
          return;
        inputRef.current.blur();
        input2Ref.current.blur();
      }}
    >
      {docs ? (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <Text style={styles.title}>HospitalLink</Text>
            <Text style={styles.subtitle}>
              The hospitals are sorted by distance
            </Text>
            <FlatList
              style={{
                marginTop: 80,
              }}
              data={[
                {
                  bedNumber: "Bed No.",
                  hospital: "Hospital",
                  distance: "Distance",
                  top: true,
                },
                ...docs
                  .filter((d) => !d.isBooked)
                  .sort((a, b) => a.distance - b.distance)
                  .map((d, i) => {
                    if (i === docs.length - 1) return { ...d, bottom: true };
                    return d;
                  }),
              ]}
              renderItem={item}
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>HospitalLink</Text>
          {isAuthorized ? (
            <>
              <TextInput
                ref={inputRef}
                style={styles.input}
                onChangeText={setEmail}
                placeholder="employee@hospital.com"
                keyboardType="email-address"
                inputMode="email"
                autoCorrect={false}
              />
              <TextInput
                ref={input2Ref}
                style={{ ...styles.input, marginTop: 20 }}
                onChangeText={setPassword}
                placeholder="password"
                secureTextEntry={true}
                autoCorrect={false}
              />

              <Pressable
                onPress={() => {
                  if (isLoading) return;
                  setIsLoading(true);
                  // validate email and password
                  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                  const isValidPassword = password.length >= 6;
                  if (!isValidEmail || !isValidPassword) {
                    setIsLoading(false);
                    alert("Invalid email or password");
                    return;
                  }
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Logging in.." : "Login"}
                </Text>
              </Pressable>
              <View
                style={{
                  color: "#f0f0f0",
                  opacity: 0.9,
                  textAlign: "center",
                  marginTop: 275,
                  width: 250,
                  flex: 1,
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Text
                  style={{
                    color: "#f0f0f0",
                    fontSize: 12,
                  }}
                >
                  If you are a hospital and want to create
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#f0f0f0",
                      fontSize: 12,
                    }}
                  >
                    employee accounts, please{" "}
                  </Text>
                  <Pressable
                    onPress={() =>
                      Linking.openURL("mailto:register@hospitalink.com")
                    }
                    style={{
                      color: "#f0f0f0",
                    }}
                  >
                    <Text
                      style={{
                        color: "#3b82f6",
                        textDecorationLine: "underline",
                        fontSize: 12,
                      }}
                    >
                      Contact Us
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text
                style={{
                  ...styles.title,
                  marginTop: 100,
                  width: 300,
                  fontWeight: "normal",
                  textAlign: "center",
                  fontSize: 35,
                }}
              >
                Welcome,{" "}
                <Text
                  style={{ opacity: 0.9, fontWeight: "bold", fontSize: 30 }}
                >
                  {email || "Guest"}👋
                </Text>
              </Text>
              <Pressable
                disabled={isLoading}
                onPress={() => {
                  if (isLoading) return;
                  setIsLoading(true);
                  getDocs();
                }}
                style={{
                  ...styles.button,
                  width: 250,
                  marginTop: 75,
                  height: 60,
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Loading.." : "Available Beds"}
                </Text>
              </Pressable>
              <Pressable
                disabled={isLoading}
                onPress={() => {
                  if (isLoading) return;
                  setIsLoading(true);
                  getDocs();
                }}
                style={{
                  ...styles.button,
                  opacity: isLoading ? 0.5 : 1,
                  backgroundColor: "#f87171",
                  width: 250,
                  height: 60,
                  marginTop: 15,
                }}
              >
                <Text style={styles.buttonText}>{"Logout"}</Text>
              </Pressable>
            </>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 47.5,
    width: 250,
    direction: "ltr",
    textAlign: "left",
    marginTop: 180,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#27272a",
    alignItems: "center",
    paddingTop: 100,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 47.5,
    width: 160,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
    marginTop: 30,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f0f0f0",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f0f0f0",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#f0f0f0",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
    color: "#f0f0f0",
    opacity: 0.8,
  },
  card: {
    borderRadius: 6,
    elevation: 3,
    width: 350,
    height: 75,
    backgroundColor: "#3b82f6",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 10,
  },
  cardText: {
    fontSize: 15,
    color: "#f0f0f0",
  },
  hospital: {
    fontSize: 19,
    fontWeight: "bold",
  },
  bedNumber: {
    fontWeight: "bold",
  },
});
