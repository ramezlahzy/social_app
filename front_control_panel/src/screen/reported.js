import { FlatList, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import API from "../redux/API";
import { IMG_URL, API_BASE } from "../config";
import CustomWhatIlearned from "../components/CustomWhatIlearned";
import { Toast } from "react-native-toast-notifications";

const Reported=()=>{
    const [whatilearned, setWhatIlearnedList] = useState([]);
    const [change, setChange] = useState(false);
    useEffect(() => {
        console.log("begin ss re sssesssssssssesported")
      API.get(API_BASE + `admin/getReportedMyWhatIlearned`)
        .then((res) => {
            console.log("res", res.data);
          let tempList = res.data.map((item) => {
            return {
              id: item.id,
              name: item.fullName,
              text: item.content,
              daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000 * 60)),
              author: item.author,
              reports: item.reports,
            };
          });
          console.log("all");
          setWhatIlearnedList(tempList);
        })
        .catch((err) => {
          console.log("err2", err);
          Toast.show("   try later    ", {
            duration: 5000,
            type: "danger",
            placement: "bottom",
          });
        });
    }, [change]);
  
    return (
      // <ScrollView>
      //   {whatilearned.map((item) => (
      //     <CustomWhatIlearned
      //       data={item}
      //       key={"mywhatilearned" + item.id}
      //       setChange={setChange}
      //     ></CustomWhatIlearned>
      //   ))}
      // </ScrollView>
      <>
        {whatilearned.length === 0 && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 20,color:'grey' }}>No What I Learned yet</Text>
          </View>
        )}
        <FlatList
          data={whatilearned}
          renderItem={({ item }) => {
            console.log("item", item.reports);

            return <CustomWhatIlearned
              data={item}
              key={"mywhatilearned" + item.id}
              setChange={setChange}
            ></CustomWhatIlearned>
        }}
          keyExtractor={(item) => item.id}
        />
      </>
    )

}
export default Reported;