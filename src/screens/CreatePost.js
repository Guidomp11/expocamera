import React from 'react';
import MyCamera from '../components/Mycamera';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../config/firebase';

export default class CreatePost extends React.Component{
    constructor(){
        super();
        this.state = {
            showCamera: true,
            description: '',
            photo: '',
        }
    }

    savePhoto(url) { //se llama desde el componente hijo y le llega la url publica para acceder a la imagen
        this.setState({
            photo: url,
            showCamera: false
        })
    }

    uploadPost(){
        db.collection("posts").add({
            name: 'Nombre de usuario',
            description: this.state.description,
            photo: this.state.photo,
            created_at: Date.now()
        })
        .then(() => {
            this.setState({showCamera: true});
        })
        .catch(e => console.error(e))
    }


    render(){
        return(
            <>
                {/* showCamera determina si muestro  la camara o el formulario para completar el posteo */}
                {
                    this.state.showCamera ? 
                        <MyCamera savePhoto={(url) => this.savePhoto(url)}/>
                    :
                        <View style={styles.form}>
                            <Text style={styles.text}>Descripcion:</Text>
                            <TextInput 
                                style={styles.input}
                                onChangeText={(text) => this.setState({description: text})}
                            />
                            <TouchableOpacity
                                style={styles.btnSubmit}
                                onPress={() => this.uploadPost()}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.btnText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                }
            </>
        )
    }
}

export const styles = StyleSheet.create({
    form: {
        flex: 1,
        width: '100%'
    },
    text: {
        fontSize: 24
    },
    btnText: {
        textAlign: 'center',
        fontSize: 24,
        color: '#2F2F2F'
    },
    input: {
        backgroundColor: '#fafafa',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        height: 50,
        marginBottom: 10,

    },
    btnSubmit: {
        width: '100%',
        height: 50,
        backgroundColor: '#7F6DF3',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 20
    },
})