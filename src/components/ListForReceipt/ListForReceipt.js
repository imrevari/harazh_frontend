import React, {useState} from 'react';

const ListForReceipt = (props) => {

    const [price, setPrice] = useState(props.price)
    const [name, setName] = useState(props.name)
    
    const priceInputField = <input 
                        name="price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={price}
                        onChange={ (event) => {
                                                setPrice(event.target.value)
                                                props.updatePrice(event.target.value)
                                            }
                                }
                    />

    const nameInputField = <input 
                        name="name"
                        value={name}
                        onChange={ (event) => setName(event.target.value)}
                    />

        return (
           
            <tr>
                <td className="price">{props.id}</td>
                <td className="name">{props.editable ? nameInputField : name}</td>
                <td className="price">{props.amount}</td>
                <td className="price">{props.editable ? priceInputField : price}</td>
                <td className="price">{props.amount * price} </td>
            </tr>
        )

}

export default ListForReceipt;