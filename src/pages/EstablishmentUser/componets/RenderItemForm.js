import { Card, Switch, Avatar, Text, Paragraph, } from 'react-native-paper';
import styles from '../styles';
import { helper } from '../../../helpers/inputs';
import { useDispatch, useSelector } from 'react-redux';
import { addOrRemoveProfessionalInArray } from '../reducer';
import { View } from 'react-native';

export default function RenderItem({ data }) {
    const item = data.item
    const dispatch = useDispatch();
    const selectedItem = useSelector((state) => state.establishmentUser.professionals);

    const toggleSwitch = (id) => {
        dispatch(addOrRemoveProfessionalInArray(id));
    };

    return (
        <Card style={styles.card}>
            <Card.Title
                title={item.name} titleStyle={styles.titleCard}
                subtitle={<Text style={{ fontWeight: 'bold' }}>CPF: <Text>{helper.maskCpf(item.cpf)}</Text></Text>}
                left={(props) => <Avatar.Text {...props} label={item.name[0]} />}
                right={(props) => (
                    <Switch
                        value={selectedItem.includes(item.id)}
                        onValueChange={() => toggleSwitch(item.id)}
                    />
                )}
            />

            <Card.Content>
                <View style={{ marginLeft: 50 }}>
                    <Paragraph> <Text style={{fontWeight: 'bold'}}> Tipo de agenda: </Text>{helper.formatTypeSchedule(item.type_schedule)}</Paragraph>
                </View>
            </Card.Content>
        </Card>
    )
};