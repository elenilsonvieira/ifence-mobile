import React from 'react';
import {Text, View} from 'react-native';

import {headerStyles} from './headerStyles';

const Hearder = (props) => {
    return (
        <View style={headerStyles.header}>
            <Text style={headerStyles.text_header}>{props.title}</Text>
        </View>
    );
};


export default Hearder;
