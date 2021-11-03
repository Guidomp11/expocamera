import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { storage } from '../config/firebase';

export default class MyCamera extends React.Component{
    constructor(){
        super();
        this.state = {
            photo: '',//guarda la URI
            permission: false,
            type: 'front'
        }
        this.camera;
        //this.camera = createRef(); o React.createRef();
    }

    componentDidMount(){
        Camera.requestCameraPermissionsAsync() //pido permiso
        .then(response => this.setState({permission: response})) //en case de tener el permiso, muestro la camara, sino no.
    }

    takePicture(){ //Se llama al sacar la foto
        if(!this.camera) return; //Camera es distinto => uso el metodo que me da
        this.camera.takePictureAsync()
        .then(photo => { //Devuelve un objeto con 3/4 props
            this.setState({
                photo: photo.uri //dato uri para hcer el fetch
            })
        })
    }

    uploadImage() {
        fetch(this.state.photo) //fetch a la uri que guarde en takePicture
        .then(res => res.blob()) //a cambio de .json() ahora es .blob() para el manejo de archivos
        .then(resolve => {
            const ref = storage.ref(`camera/${Date.now()}`); //guardo la referencia a la posicion del storage donde voy a guardar la imagen
            ref.put(resolve) //subo la imagen a la direccion previamente guardada
            .then(() => {
                ref.getDownloadURL() //obtengo la url publica para poder acceder desde la web
                .then(url => {
                    this.props.savePhoto(url); //Se la paso al padre quien va a crear el posteo completo
                })
            })
        })
    }

    onReject() {
        this.setState({photo: ''}); //en caso de que quiera eliminar la foto que saco despues de ver el preview
    }

    render(){
        if(!this.state.permission) return <Text>No hay permisos.</Text>
        return(
            <View style={styles.container}>
                {/*ACVITO LA PREVIEW CON ESTE IF -> SI PHOTO TIENE ALGO QUIERE DECIR QUE HAY UNA URI*/}
                {
                    this.state.photo ? (
                        <View style={styles.container}>
                            <Image style={styles.preview} source={{uri: this.state.photo}} />
                            <View style={styles.btnContainer}>
                                <TouchableOpacity
                                    style={styles.reject}
                                    onPress={() => this.onReject()}
                                ><Text style={styles.text}>Cancelar</Text></TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.accept}
                                    onPress={() => this.uploadImage()}
                                ><Text style={styles.text}>Subir</Text></TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Camera
                            style={styles.camera}
                            type={Camera.Constants.Type.back || Camera.Constants.Type.front}
                            ref={ref => this.camera = ref}
                        >
                            {/*ref={this.camera}*/}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.takePicture()}>
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    )
                }
            </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    camera: {
        flex: 1,
        width: '100%'
    },
    buttonContainer: {
        width: '100%',
        height: 124,
        position: 'absolute',
        bottom: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        width: 124,
        height: '100%',
        borderWidth: 5,
        borderColor: 'white',
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    text: {
        width: '100%',
        textAlign: 'center',
        color: 'white',
        paddingTop: 15
    },
    imageContainer: {
        height: '90%',
    },
    preview: {
        width: '100%',
        flex: 6
    },
    btnContainer: {
        flex: 1,
        backgroundColor: '#000020',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    accept: {
        width: 100,
        height: 50,
        backgroundColor: '#7F6DF3',
        borderRadius: 50
    },
    reject: {
        width: 100,
        height: 50,
        backgroundColor: '#FF392B',
        borderRadius: 50
    }
})
