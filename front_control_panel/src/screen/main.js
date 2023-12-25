import React, { useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { useState } from "react";
import axios from "axios";
import API from "../redux/API";
import { API_BASE } from "../config";
import { Dimensions } from "react-native";

const MainScreen = ({ navigation }) => {
  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    fillShadowGradient: "#fff",
    //white background
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    //black background
  };
  const [data, setDate] = useState({
    labels: [
      "5 Months ago",
      "4 Months ago",
      "3 Months ago",
      "2 Months ago",
      "1 Months ago",
      "Now",
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        color: (opacity = 1) => `grey`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Users"], // optional
  });

  useEffect(() => {
    console.log("useEffesct begins");
    API.get(API_BASE + "admin/recentUsers")
      .then((res) => {
        console.log("dasjsa res  " + res.data);
        const data = {
          labels: [
            "5 Months ago",
            "4 Months ago",
            "3 Months ago",
            "2 Months ago",
            "1 Months ago",
            "Now",
          ],
          datasets: [
            {
              data: res.data,
              color: (opacity = 1) => `grey`, // optional
              strokeWidth: 2, // optional
            },
          ],
          legend: ["Users"], // optional
        };

        setDate(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const screenWidth = Dimensions.get("window").width;

  const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor:"#304D30",
        width: "90%",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 20,
        alignSelf: "center",
        marginBottom: 20,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
    </TouchableOpacity>
  );
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 30,
          marginTop: 70,
          textAlign: "center",
        }}
      >
        Admin Panel
      </Text>

      <LineChart
        data={data}
        width={screenWidth}
        height={256}
        verticalLabelRotation={30}
        chartConfig={chartConfig}
        bezier
      />

      <CustomButton
        title="all Users"
        onPress={() => {
          navigation.navigate("Users");
        }}
      />
      <CustomButton
        title="Reported Posts"
        onPress={() => {
          navigation.navigate("Reported");
        }}
      />
      <CustomButton
        title="all What I learned"
        onPress={() => {
          navigation.navigate("WhatILearned");
        }}
      />
      <CustomButton
        title="send Notification"
        onPress={() => {
          navigation.navigate("Notification");
        }}
      />
    </ScrollView>
  );
};

export default MainScreen;
