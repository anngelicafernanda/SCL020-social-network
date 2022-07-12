import {
	db,
	addDoc,
	collection,
	getDocs,
	onSnapshot,
	query,
	doc,
	deleteDoc,
	auth,
	onAuthStateChanged,
	where,
	updateDoc,
} from './init.js';

// --> funcion que escucha el evento para crear post //
export const createPost = () => {
	const formPost = document.querySelector('#form_post');
	formPost.addEventListener('submit', async (e) => {
		e.preventDefault();
		const title = formPost.postTitle.value; // asi accedo a los valores del formulario por su nombre
		const text = formPost.postText.value;
		let autor = '';
		await onAuthStateChanged(auth, (user) => {
			console.log(user);
			autor = user.email;
		});
		newPost(autor, title, text);
	});
};
// --> promesa para crear post //
export const newPost = (autor, title, text) => {
	addDoc(collection(db, 'Comentarios'), {
		Autor: autor,
		Content: text,
		Title: title,
	})
		.then(() => {
			document.querySelector('#postText').value = '';
			document.querySelector('#postTittle').value = '';
		})
		.catch(() => {
			alert('Error');
		});
};

// --> funcion para mostrar post en viewHome//
export const snapshot = (callback) => {
	const lookPost = query(collection(db, 'Comentarios'));
	onSnapshot(lookPost, callback);
};

// --> funcion para mostrar post en viewProfile filtrado segun usuario activo//
export const snapshotProfile = (callback) => {
	let autor = '';
	onAuthStateChanged(auth, (user) => {  //uso el metodo observador para acceder al usuario que se loguea
		console.log(user);
		autor = user.email;
		const lookPostProfile = query(
			collection(db, 'Comentarios'),
			where('Autor', '==', autor), 
		);// trae los comentadios "donde/where" autor es igual al logueado (accedemos por medio de observador)
		console.log(autor);
		onSnapshot(lookPostProfile, callback);
	});
};

// --> Promesa para borrar post (viewProfile)//
export const deletePost = (id) => {
	deleteDoc(doc(db, 'Comentarios', id))
		.then(() => {
			alert('Post eliminado');
		})
		.catch(() => {
			alert('Error al eliminar el post');
		});
};

// --> Promesa para editar post (viewProfile)//
export const updatePost = (id, title, text) => {
	updateDoc(doc(db, 'Comentarios', id), {
		Content: text,
		Title: title,
	}).then(() => {
			alert("funciono")
		})
		.catch(() => {
			alert('Error');
		});
};


