import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import BraceletService from "../../services/BraceletService";

import styles from "./styles";

export default function DropdownFenceBracelet(props) {
  const braceletService = new BraceletService();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    braceletService
      .get()
      .then((response) => {
        let arr = response.data.content.map((item) => {
          return { label: item.name, value: item.id };
        });
        setItems(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={[styles.container, props.style]}>
      <DropDownPicker
        open={open}
        value={props.value}
        items={items}
        setOpen={setOpen}
        setValue={props.setValue}
        setItems={setItems}
        theme="DARK"
        multiple={true}
        mode="BADGE"
        badgeDotColors={[
          "#e76f51",
          "#00b4d8",
          "#e9c46a",
          "#e76f51",
          "#8ac926",
          "#00b4d8",
          "#e9c46a",
        ]}
      />
    </View>
  );
}
