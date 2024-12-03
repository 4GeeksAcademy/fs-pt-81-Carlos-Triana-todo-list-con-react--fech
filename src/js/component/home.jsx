import React, { useEffect, useState } from "react";

const Home = () => {
	const [userData, setUserData] = useState({});
	const [todo, setTodo] = useState('');

	useEffect(() => {
		crearUsuario();
		getUserData();
	}, []);

	
	const crearUsuario = () => {
		fetch("https://playground.4geeks.com/todo/users/Patricia", {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		})
			.then(respuesta => {
				if (!respuesta.ok) throw new Error('Error al crear usuario');
				return respuesta.json();
			})
			.then(datos => console.log('Usuario creado', datos))
			.catch(error => console.error('Error en crearUsuario', error));
	};

	
	const getUserData = () => {
		fetch("https://playground.4geeks.com/todo/users/Patricia")
			.then(respuesta => {
				if (!respuesta.ok) throw new Error('Error al obtener datos del usuario');
				return respuesta.json();
			})
			.then(datos => {
				console.log('getUserData ahora en datos', datos);
				setUserData(datos);
			})
			.catch(error => console.error('Error en getUserData', error));
	};

	
	const crearTarea = () => {
		if (todo.trim().length === 0) return alert('La tarea no puede estar vacía');
		fetch("https://playground.4geeks.com/todo/todos/Patricia", {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({ label: todo, done: false }),
		})
			.then(respuesta => {
				if (!respuesta.ok) throw new Error('Error al crear tarea');
				return respuesta.json();
			})
			.then(datos => {
				console.log('Tarea creada:', datos);
				setTodo('');
				getUserData(); 
			})
			.catch(error => console.error('Error en crearTarea:', error));
	};

	
	const handleSubmit = e => {
		e.preventDefault();
		if (todo.trim().length === 0) {
			return alert('La tarea no puede estar vacía');
		}
		crearTarea();
	};

	
	const handleDelete = (id) => {
		
		fetch("https://playground.4geeks.com/todo/todos/" + id, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
			},
		})
			.then(respuesta => {
				if (!respuesta.ok) throw new Error('Error al eliminar la tarea');
				return respuesta.json();
			})
			.then(datos => {
				console.log('Tarea eliminada:', datos);
				setUserData(prevState => ({
					...prevState,
					todos: prevState.todos.filter(tarea => tarea.id !== id)
				}));
			})
			.catch(error => console.error('Error en handleDelete:', error));
	};

	console.log('mirar estructura', userData);

	return (
		<div className="text-center">
			<h1 className="text-center mt-5">Lista de tareas</h1>
			<form onSubmit={handleSubmit}>
				<input
					className="bg-light border-0"
					type="text"
					value={todo}
					onChange={e => setTodo(e.target.value)}
					placeholder="Escribe una tarea"
				/>
				<button className="border-0 rounded bg-primary text-white" type="submit">Agregar tarea</button>
			</form>

			<ul style={{ listStyleType: 'none', padding: 0 }}>
				{Array.isArray(userData.todos) && userData.todos.length > 0
					? userData.todos.map(tarea => (
						<li key={tarea.id}>
							{tarea.label} {tarea.is_done && ''}
							
							<span
								style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}
								onClick={() => handleDelete(tarea.id)}
>
								x
							</span>
						</li>
					))
					: 'No hay tareas'}
			</ul>
		</div>
	);
};

export default Home;



