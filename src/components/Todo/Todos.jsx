import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SectionsWrapper } from "../../styled-components";
import TodosSection from "./TodosSection";
import { useRecoilState, useSetRecoilState } from "recoil";
import { todosState, userState } from "../../recoil/atoms";
import { useEffect } from "react";
import { Button } from "../../utils/styles";
import { FaPlusSquare } from "react-icons/fa";
import { fetchTodos, updateTodo } from "../../APIs/todo";
import Modal from "react-modal";
import { useState } from "react";
import TodoEditor from "./TodoEditor";
import { HomeRoutes } from "../../Routes";
import { useRouteMatch } from "react-router-dom";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    background: "#000000ab",
  },
};

function Todos() {
  const [{ todos, isLoading }, setTodos] = useRecoilState(todosState);
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [userData] = useRecoilState(userState);
  const setAccountData = useSetRecoilState(userState);
  const { url } = useRouteMatch();

  useEffect(() => {
    const routeConfig = HomeRoutes.find((r) => r.path === url);
    setAccountData((prev) => ({
      ...prev,
      currentPathName: routeConfig.name,
    }));
  }, [url]);

  useEffect(() => {
    const getTodos = async () => {
      const res = await fetchTodos(userData.token);
      setTodos((prev) => ({
        ...prev,
        todos: res.todos,
        isLoading: false,
      }));
    };
    if (isLoading) {
      getTodos();
    }
  }, [isLoading]);

  async function onDrop(e, section) {
    setTodos((prev) => {
      let todos = [...prev.todos].filter((t) => t._id !== e.todo._id);
      return {
        ...prev,
        todos: [
          ...todos,
          {
            ...e.todo,
            status: section,
          },
        ],
      };
    });
    let todo = todos.find((t) => t._id === e.todo._id);
    todo = {
      ...todo,
      status: section,
    };
    await updateTodo(e.todo._id, todo, userData.token);
  }

  function addTodo() {
    setIsAddTodoOpen((prev) => !prev);
  }

  function closeModal() {
    setIsAddTodoOpen(false);
  }

  function onSuccess() {
    setTodos((prev) => ({
      ...prev,
      isLoading: true,
    }));
    setIsAddTodoOpen(false);
  }

  function onClose() {
    setIsAddTodoOpen(false);
  }

  if (isLoading) return <div>Loading..</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={addTodo}>
          <FaPlusSquare className="icon" />
          <span className="text">Add Todo</span>
        </Button>
      </div>
      <Modal
        isOpen={isAddTodoOpen}
        style={customStyles}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        onRequestClose={closeModal}
      >
        <TodoEditor onSuccess={onSuccess} onClose={onClose} />
      </Modal>
      <SectionsWrapper>
        <TodosSection
          title="Open"
          todos={todos.filter((t) => t.status === "open")}
          id="open"
          onDrop={onDrop}
        />
        <TodosSection
          title="In Progress"
          todos={todos.filter((t) => t.status === "inprogress")}
          id="inprogress"
          onDrop={onDrop}
        />
        <TodosSection
          title="Done"
          todos={todos.filter((t) => t.status === "done")}
          id="done"
          onDrop={onDrop}
        />
      </SectionsWrapper>
    </DndProvider>
  );
}

export default Todos;
