import { Card, Switch, Avatar, Paragraph, } from 'react-native-paper';
import styles from '../styles';
import { helper } from '../../../helpers/inputs';
import { useDispatch, useSelector } from 'react-redux';
import { addOrRemoveEstablishmentInArray } from '../reducer';

export default function RenderItem({ data }) {
    const item = data.item
    const dispatch = useDispatch();
    const selectedItem = useSelector((state) => state.myEstablishments.establishiments);

    const toggleSwitch = (id) => {
        dispatch(addOrRemoveEstablishmentInArray(id));
    };

    return (

        <Card style={styles.card}>
            <Card.Title
                title={item.name} titleStyle={styles.titleCard}
                right={(props) => (
                    <Switch
                        value={selectedItem.includes(item.id)}
                        onValueChange={() => toggleSwitch(item.id)}
                    />
                )}
            />
            <Card.Content>
                <Paragraph>{`Responsalvel: ${item.responsible}`}</Paragraph>
                <Paragraph>{`Telefone: ${helper.maskPhone(item.phone)}`}</Paragraph>
            </Card.Content>
        </Card>
    )
};