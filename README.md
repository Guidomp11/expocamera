###PASOS###
1) npm i expo-camera.
2) Crear el componente MyCamera (No llamarlo camera porque el componente de expo se llama asi).
3) import { Camera } from 'expo-camera';
4) 2 variables de estado: photo (almacena la url de la foto que se sube) y permission (true o false dependiendo si el usuario da los permisos)
5)en el contructor pero por fuera del estado crear la variable this.camera; (por fuera del estado porque despues la seteamos en el render y si se hace setState ahi, bucle infinito)
6)ComponentDidMount pedimos los permisos.
7)Componente Camera:
    <Camera
        style={styles.camera} //estilo
        type={Camera.Constants.Type.back} //camara que se va a usar
        ref={ref => this.camera = ref} // seteamos la variable camera con la referencia a ese componente
    >
    </Camera>
8)metodo takePicture: se llama al presionar el boton de sacar foto. Priemro pregunta si la varibale this.camera es != null y si pasa esa validacion, this.camera.takePictureAsync() es un metodo de la camara que devuelve una promesa.
    .then(photo => { //datos de la foto
        this.setState({
            photo: photo.uri //solo interesa la uri de la foto
        })
    })
9)metodo uploadImage:
    fetch(this.state.photo)//hacemos fetch a la uri
        .then(res => res.blob()) //a cambio de .json() ahora .blob() que se utiliza para el manejo de archivos
        .then(resolve => {
            const ref = storage.ref(`camera/${Date.now()}`); //obtenemos la referencia de donde se alamcenara la foto
            ref.put(resolve) //actualizamos esa referencia con la foto
            .then(() => {
                ref.getDownloadURL() //obtenemos el link publico de esa foto
                .then(url => {
                    this.props.savePhoto(url); //se la pasamos al componente padre para que la guarde en el estado
                })
            })
    })
10) onReject: setea el estado photo en '' para borrar el preview.

) Crean una Screen que con un if ternario se determina si mostrar la camara o el formulario