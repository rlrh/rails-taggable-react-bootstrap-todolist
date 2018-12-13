class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: [], text: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        fetch('/api/todos.json')
            .then((response) => { return response.json() })
            .then((data) => { this.setState({ items: data }) });
    }

    render() {
        return (
            <main class="nusmods-main">
                <div>
                    <h3>Todolist On React Rails</h3>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            className="input"
                            onChange={this.handleChange}
                            value={this.state.text}
                            placeholder="What do you need to do? (Press Enter for new to-do)"
                            autofocus="true"
                        />
                    </form>
                    <TodoList items={this.state.items} deleteHandler={this.handleDelete} completeHandler={this.handleComplete} editHandler={this.handleEdit} />
                </div>
            </main>
        );
    }



    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSubmit(e) {
        
        e.preventDefault();
        if (!this.state.text.length) {
            return;
        }
        
        let body = JSON.stringify({todo: {completed: false, description: this.state.text} })
        fetch('api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body,
        })
        .then((response) => { return response.json(); })
        .then((todo)=>{
            this.setState(state => ({
                items: state.items.concat(todo),
                text: ''
            }));
        });

    }

    handleComplete(key) {
        let items = [...this.state.items];
        const index = items.findIndex(item => item.id == key);
        let item = { ...items[index] };
        if (item.completed)
            item.completed = false;
        else
            item.completed = true;
        items[index] = item;
        this.setState({ items });
    }

    handleDelete(key) {
        this.setState({ items: this.state.items.filter(item => item.id != key) })
    }

    handleEdit(key, text) {
        let items = [...this.state.items];
        const index = items.findIndex(item => item.id == key);
        let item = { ...items[index] };
        item.text = text;
        items[index] = item;
        this.setState({ items });
    }

}

class TodoList extends React.Component {
    render() {
        return (
            <ul>
                {this.props.items.map(item => <Todo id={item.id} text={item.description} completed={item.completed} deleteHandler={this.props.deleteHandler} completeHandler={this.props.completeHandler} editHandler={this.props.editHandler} />)}
            </ul>
        );
    }
}

class Todo extends React.Component {

    constructor(props) {
        super(props);
        this.state = { editing: false, text: this.props.text };
        this.handleChange = this.handleChange.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleEditing(e) {
        if (this.state.editing)
            this.setState({ editing: false });
        else
            this.setState({ editing: true });
    }

    render() {

        if (this.state.editing) {
            return (
                <li key={this.props.id}>
                    <input onChange={this.handleChange} value={this.state.text} />
                    <button
                        onClick={(e) => {
                            this.props.editHandler(this.props.id, this.state.text);
                            this.handleEditing(e);
                        }}
                    >
                        Done
              </button>
                </li>
            );
        } else {
            return (
                <li key={this.props.id}>
                    <input
                        type="checkbox"
                        checked={this.props.completed}
                        onChange={() => this.props.completeHandler(this.props.id)}
                    />
                    {this.props.completed ? <span className="strike">{this.state.text}</span> : <span>{this.state.text}</span>}
                    <button className="right" onClick={() => this.props.deleteHandler(this.props.id)}>Delete</button>
                    <button className="right" onClick={this.handleEditing}>Edit</button>
                </li>
            );
        }

    }

}