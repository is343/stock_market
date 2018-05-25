import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUsers } from "../store/actions/user";
import "./users.css";

class Users extends Component {
  static defaultProps = {
    users: [],
  };

  componentWillMount() {
    this.props.getUsers();
  }

  render() {
    return (
      <div>
        <h2>Users</h2>
        <ul>
          {this.props.users.map(user => (
            <li key={user.id}>
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Users.propTypes = {
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
});

const dispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
});

export default connect(mapStateToProps, dispatchToProps)(Users);
