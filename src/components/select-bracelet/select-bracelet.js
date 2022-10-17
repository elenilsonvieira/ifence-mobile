import React, {useEffect, useState} from 'react';
import {
  View,
} from 'react-native';
import BraceletService from '../../services/BraceletService';
import SelectList from 'react-native-dropdown-select-list';

function SelectBracelet(props) {
    const braceletService = new BraceletService();
    const [data,setData] = useState([]);

    useEffect(() => {
        getAll();
    }, [])

    const getAll = () => {
        braceletService.get()
            .then((response) => {
                let arr = response.data.content.map((item) => { 
                    return {key:item.id, value:item.name} 
                });
                arr.splice(0, 0, {key:0, value:"Todos"});
                setData(arr) 
            }).catch((error) => {
                console.log(error);
            });
    }

    return (
        <View>
            <SelectList 
                setSelected={props.setSelected} 
                data={data} 
                onSelect={props.onSelect} 
                inputStyles={{color: '#000000'}}
                dropdownTextStyles={{color: '#000000'}}
            />
        </View>
    );
}

export default SelectBracelet;