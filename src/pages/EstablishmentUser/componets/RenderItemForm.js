import { Card, Switch, Avatar, } from 'react-native-paper';
import styles from '../styles';
import { helper } from '../../../helpers/inputs';
import { useDispatch, useSelector } from 'react-redux';
import { addOrRemoveProfessionalInArray } from '../reducer';

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
                subtitle={`CPF: ${helper.maskCpf(item.cpf)}`}
                left={(props) => <Avatar.Text {...props} label={item.name[0]} />}
                right={(props) => (
                    <Switch
                        value={selectedItem.includes(item.id)}
                        onValueChange={() => toggleSwitch(item.id)}
                    />
                )}
            />
        </Card>
    )
};