import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
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

export default function App() {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getDocs() {
    fetchAPI()
      .then((r) => r.json())
      .then((r) => {
        setDocs(r.docs);
        setLoading(false);
        getDocs();
      });
  }

  const item = ({ item }) => (
    <>
      <View
        style={{
          flexDirection: "row",
          color: "white",
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
              color: "white",
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
              color: "white",
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
                    backgroundColor: "white",
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
              color: "white",
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
          style={{ width: 380, height: 1, backgroundColor: "white" }}
        ></View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
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
          <Pressable
            onPress={() => {
              if (loading) return;
              setLoading(true);
              getDocs();
            }}
            style={loading ? styles.loadingButton : styles.button}
          >
            <Text style={styles.buttonText}>
              {loading ? "Loading.." : "Available Beds"}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#27272a",
    alignItems: "center",
    paddingTop: 100,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#3b82f6",
    marginTop: 250,
  },
  loadingButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
    opacity: 0.2,
    backgroundColor: "#3b82f6",
    marginTop: 250,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
    color: "white",
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
    color: "white",
  },
  hospital: {
    fontSize: 19,
    fontWeight: "bold",
  },
  bedNumber: {
    fontWeight: "bold",
  },
});
