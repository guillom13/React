/**
 * 
 */
const React = require('react');
const ReactDOM = require('react-dom')
const rest = require('rest');
const $ = require("jquery");
const moment = require('moment');
var DatePicker = require('react-datepicker');

// Main Component
class UserApp extends React.Component{
	  
	constructor(props) {
		super(props);
		this.state = {data: [], pageSize: 5, links: {}};
		this.loadUsersFromServer = this.loadUsersFromServer.bind(this);
		this.handleUserSubmit = this.handleUserSubmit.bind(this);
		this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
		this.handleFilterReset = this.handleFilterReset.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}
	
	// load all the users
	loadUsersFromServer(nav) {
		
		$.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      data:{size: this.state.pageSize},	      
	      cache: false,
	      success: function(data) {
	    	  console.info('success load data');
	    	  console.info(data);
	        this.setState({data: data._embedded.users,
					links: data._links}); //response.entity._embedded.users
	        if(nav){
	        	this.onNavigate(data._links.last.href);
	        }
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	}
	
	// create user
	handleUserSubmit(user) {
		console.info(user);
		
		$.ajax({
		      url: this.props.url,
		      dataType: 'json',
		      headers: {'Content-Type':'application/json'},
		      type: 'POST',
		      data: JSON.stringify(user),
		      success: function(data) {
		    	  console.info(data);
		        //this.setState({data: data});
		    	  this.loadUsersFromServer('last');
		    	  
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		 });
	}
	
	// filter the table
	handleFilterSubmit(filter) {
		
		
		if (!filter.firstNameSearch && !filter.lastNameSearch && !filter.dobSearch) {
		      return;
		}/*
		var filteredUsers = [];
		if (filter.firstNameSearch){
			console.info('in first ' + filter.firstNameSearch);
			filteredUsers = this.state.data
		      .filter(e => e.firstName.toUpperCase().includes(filter.firstNameSearch.toUpperCase())).map(e => e);
			this.setState({data: filteredUsers});
			console.info('in first ' +  filteredUsers);
		}
		if (filter.lastNameSearch){
			console.info('in last' + filter.lastNameSearch);
			filteredUsers = this.state.data
		      .filter(e => e.lastName.toUpperCase().includes(filter.lastNameSearch.toUpperCase())).map(e => e);
			console.info('in first ' +  filteredUsers);
		}
		
		console.info(filteredUsers);
		this.setState({data: filteredUsers});
		*/
		var params = {size: this.state.pageSize};
		if (!filter.firstNameSearch && filter.lastNameSearch && !filter.dobSearch) {
			params = {size: this.state.pageSize, lastName: filter.lastNameSearch};
		} else if (filter.firstNameSearch && !filter.lastNameSearch && !filter.dobSearch) {
			params = {size: this.state.pageSize, firstName: filter.firstNameSearch};
		} else if (!filter.firstNameSearch && !filter.lastNameSearch && filter.dobSearch) {
			params = {size: this.state.pageSize, dob: filter.dobSearch};
		} else if (filter.firstNameSearch && filter.lastNameSearch && !filter.dobSearch) {
			params = {size: this.state.pageSize, firstName: filter.firstNameSearch, lastName: filter.lastNameSearch};
		} else if (!filter.firstNameSearch && filter.lastNameSearch && filter.dobSearch) {
			params = {size: this.state.pageSize, lastName: filter.lastNameSearch, dob: filter.dobSearch};
		} else if (filter.firstNameSearch && !filter.lastNameSearch && filter.dobSearch) {
			params = {size: this.state.pageSize, firstName: filter.firstNameSearch, dob: filter.dobSearch};
		}  else if (filter.firstNameSearch && filter.lastNameSearch && filter.dobSearch) {
			params = {size: this.state.pageSize, firstName: filter.firstNameSearch, lastName: filter.lastNameSearch, dob: filter.dobSearch};
		}
		console.info(params);
		$.ajax({
		      url: this.props.url+'/search/findByFirstNameAndLastNameAndDobAllIgnoreCase',
		      dataType: 'json',
		      data: params ,
		      
		      cache: false,
		      success: function(data) {
		    	  console.info('success load data');
		    	  console.info(data);
		        this.setState({data: data._embedded.users,
						links: data._links}); //response.entity._embedded.users
		        
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	}
	
	// reset the filter
	handleFilterReset(){
		this.loadUsersFromServer();		
	}
	
	// manage the pagination
	onNavigate(navUri) {
		console.info(navUri);
		
		$.ajax({
            url: navUri,
            data: {
                page: this.state.pageSize
            },
            dataType: "json",
            success: function (data) {
            	this.setState({
    				data: data._embedded.users,
    				pageSize: this.state.pageSize,
    				links: data._links
    			});
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(this.props.url, status, err.toString());
            }.bind(this)
        });
		
	}
	
	componentDidMount() {
	    this.loadUsersFromServer();
	    // uncomment if you want to load the users from the DB with an interval
	    //setInterval(this.loadUsersFromServer, this.props.pollInterval);
	}
	
	render() {
	    return (
	    <div className="row">
	    	<div className="userFilter">
	    		 <h3>Search</h3>
	    		 <UsersFilter onFilterSubmit={this.handleFilterSubmit} onFilterReset={this.handleFilterReset}/>
	    	</div>
	    	<div className="userApp">
	        
		        <h3>Users</h3>
		        <UserList data={this.state.data} links={this.state.links}
				  pageSize={this.state.pageSize}
				  onNavigate={this.onNavigate}/>
		     </div>
		     <div className="userCreation">
		     	<h3>Create User</h3>
		     	<UserForm onUserSubmit={this.handleUserSubmit} />
		    </div>
	     </div>
	    );
	  }
}

class UserList extends React.Component{
	
	constructor(props) {
		super(props);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
	}  
		
	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}
	
	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}
	
	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}
	
	render() {
		var userNodes = this.props.data.map(user =>
		        <User firstName={user.firstName} lastName={user.lastName} dob={user.dob}
		        		key={user._links.self.href}/>		        
		);
		  
		var navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>First</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>Prev</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>Next</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>Last</button>);
		}
		return (
		   <div className="userList">
		        
		        <table>
				<tbody>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>DOB</th>
					</tr>
					{userNodes}
				</tbody>
			</table>
			<div>
				{navLinks}
			</div>
		  </div>
		);
	  }
}

//Create a new User Component
class UserForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {firstName: '', lastName: '', dob: '', startDate: null};
		this.handleLastNameChange = this.handleLastNameChange.bind(this);
		this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDobChange = this.handleDobChange.bind(this);
	}
	
	handleLastNameChange(e) {
		this.setState({lastName: e.target.value});
	}

	handleFirstNameChange(e) {
		this.setState({firstName: e.target.value});
	}
	
	handleDobChange(date) {
		
	    var dateEntered = moment(date).format('YYYY-MM-DD');
		console.info(dateEntered);
		if (!moment(dateEntered, 'YYYY-MM-DD').isValid()) {
		  console.error('Invalid Date');
		  alert('Please enter a valid date');
		  this.setState({dob: '', startDate: null});
		} else {
		  console.info('Valid Date');
		  this.setState({dob: dateEntered, startDate: date});
		}
	}
	
	handleSubmit(e) {
	    e.preventDefault();
	    var lastName = this.state.lastName.trim();
	    var firstName = this.state.firstName.trim();
	    var dob = this.state.dob;
	    if (!firstName || !lastName || !dob) {
	    	alert('All the fields are mandatory');
	    	return;
	    }
	    // send params to the parent component
	    this.props.onUserSubmit({firstName: firstName, lastName: lastName, dob: dob});
	    // reinit form
	    this.setState({lastName: '', firstName: '', dob: '', startDate: null});
	
	}
	
	render() {
	    return (
	      
	      <form className="userForm" onSubmit={this.handleSubmit}>
		      <input
	          type="text" placeholder="First Name"
	          value={this.state.firstName} onChange={this.handleFirstNameChange}
		      /> 
	      	 <input
	          type="text" placeholder="Last Name"
	          value={this.state.lastName} onChange={this.handleLastNameChange}
		      />
		      <DatePicker
		      	dateFormat="YYYY-MM-DD"
		      	selected={this.state.startDate}
		        onChange={this.handleDobChange} 
		      	placeholderText="DOB"
			    peekNextMonth 
			    showMonthDropdown 
			    showYearDropdown 
			    dropdownMode="select"
		      />
		      <input type="submit" value="Save" />
	      </form>
	      
	    );
	}
}

// User Filter Component
class UsersFilter extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {lastNameSearch: '', firstNameSearch: '', dobSearch: '', startDateSearch: null};
		this.handleLastNameFilter = this.handleLastNameFilter.bind(this);
		this.handleFirstNameFilter = this.handleFirstNameFilter.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleDobFilter = this.handleDobFilter.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}
	
	handleLastNameFilter(e) {
		this.setState({lastNameSearch: e.target.value});
	}	
	
	handleFirstNameFilter(e) {
		this.setState({firstNameSearch: e.target.value});
	}
	
	handleDobFilter(date) {
		var dateEntered = moment(date).format('YYYY-MM-DD');
	    
		console.info(dateEntered);
		if (!moment(dateEntered, 'YYYY-MM-DD').isValid()) {
		  console.error('Invalid Date');
		  alert('Please enter a valid date');
		  this.setState({dobSearch: '', startDateSearch: null});
		} else {
		  console.info('Valid Date');
		  this.setState({dobSearch: dateEntered, startDateSearch: date});
		}
	}
	
	handleFilter(e) {	
		e.preventDefault();
	    var lastNameSearch = this.state.lastNameSearch.trim();
	    var firstNameSearch = this.state.firstNameSearch.trim();
	    var dobSearch = this.state.dobSearch;
	    
	    // send params to the parent component
	    this.props.onFilterSubmit({lastNameSearch: lastNameSearch, firstNameSearch: firstNameSearch, dobSearch: dobSearch});
	    // reinit form
	    this.setState({lastNameSearch: '', firstNameSearch: '', dobSearch: '', startDateSearch: null});	    
	}
	
	handleReset(e){
		// call the parent component
	    this.props.onFilterReset();
	}
	
	render() {
		return (
	      
	      	<form onSubmit={this.handleFilter} onReset={this.handleReset}>
	      	<input
	          type="text" placeholder="First Name"
	          value={this.state.firstNameSearch} onChange={this.handleFirstNameFilter}
		      />
	      	<input
	          type="text" placeholder="Last Name"
	          value={this.state.lastNameSearch} onChange={this.handleLastNameFilter}
		      />
	      	<DatePicker
		      	dateFormat="YYYY-MM-DD"
		      	selected={this.state.startDateSearch}
		        onChange={this.handleDobFilter} 
		      	placeholderText="DOB"
			    peekNextMonth 
			    showMonthDropdown 
			    showYearDropdown 
			    dropdownMode="select"
		      />
			 <br/>
			<input type="submit" value="Search" />
      		<input type="reset" value="Reset" />
      		</form>
		)
	}
	
}

//User Component
class User extends React.Component {
	
	constructor(props) {
		super(props);
	}
	
	render() {
		 	
		var formatDate = this.props.dob;
		if(this.props.dob) {
	 		formatDate = this.props.dob.substr(0,10);
	 	}
	    return (
	    	<tr>
				<td>{this.props.firstName}</td>
				<td>{this.props.lastName}</td>
				<td width="80">{formatDate}</td>	                
			</tr>
	      
	    );
	  }
}

ReactDOM.render (
	<UserApp url="/api/users" pollInterval={2000} />,
	document.getElementById('content')
);


