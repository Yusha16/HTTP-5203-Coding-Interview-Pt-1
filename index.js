//Global variables
var nameFilter = "";
var rolesFilter = new Array();
var membersData = new Array();
const NUM_MEMBERS_PAGE_LIMIT = 6;
var currentPage = 0;

window.onload = OnLoad;

function OnLoad() {
    GetMemberData("http://sandbox.bittsdevelopment.com/code1/fetchemployees.php");
    GetRoleData();
}

async function GetMemberData(url) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        //When we get the data
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            //console.log(myArr);
            
            //Here we will create all the members

            //Loop through every prop in the obj 
            //key: the name of the object key
            Object.keys(myArr).forEach(function(key) {
                //console.log(key);
                //Here we will filter the name of the member before creating
                if (myArr[key].employeefname.includes(nameFilter) ||
                    myArr[key].employeelname.includes(nameFilter)) {
                        membersData.push(CreateMember(myArr[key]));
                }
            });
            //Create the Pagination
            CreatePagination();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

async function GetRoleData() {
    var xmlhttp = new XMLHttpRequest();
    var url = "http://sandbox.bittsdevelopment.com/code1/fetchroles.php";

    xmlhttp.onreadystatechange = function() {
        //When we get the data
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            //console.log(myArr);

            var roles = document.getElementById("roles");
            var role;
            //Here we will create all the roles
            for(var i = 0; i < Object.keys(myArr).length; i++) {
                role = CreateRole(myArr[i]);
                //Set the opacity to 1
                role.style.opacity = 1;
                role.onclick = function() {
                    //Get the role id
                    //console.log(this.getElementsByClassName("roleId")[0].innerHTML);

                    //Toggle the opacity
                    this.style.opacity = this.style.opacity == 1 ? 0.5 : 1;

                    //Need to filter the name and roles
                    ToggleRole(this.getElementsByClassName("roleId")[0].innerHTML);            
                    //console.log(rolesFilter);
                };
                rolesFilter.push(role.getElementsByClassName("roleId")[0].innerHTML);
                roles.appendChild(role);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function CreateMember(memeberData) {
    //Check the member data
    //console.log(memeberData);

    var members = document.getElementById("members");
    
    //Set up member element
    var member = document.createElement("div");
    member.setAttribute("class", "member");

    //if the member is featured
    if (memeberData.employeeisfeatured === "1") {
        //Set up featured icon
        var featuredIcon = document.createElement("div");
        //featuredIcon.innerHTML = "👑";
        featuredIcon.innerHTML = String.fromCodePoint(0x1F451);
        featuredIcon.setAttribute("class", "memberFeaturedIcon");

        member.appendChild(featuredIcon);
    }

    //Set up member image
	var memberImageWrapper = document.createElement("div");
    var memberImage = document.createElement("img");
    memberImage.setAttribute("src", "http://sandbox.bittsdevelopment.com/code1/employeepics/" + memeberData.employeeid + ".jpg")
    memberImage.setAttribute("class", "memberImg");
    memberImageWrapper.appendChild(memberImage);
	memberImageWrapper.setAttribute("class", "memberImgWrapper");
    member.appendChild(memberImageWrapper);

    //Set up member name
    var memberName = document.createElement("h2");
    memberName.innerHTML = memeberData.employeefname + " " + memeberData.employeelname;
    memberName.setAttribute("class", "memberName");
    member.appendChild(memberName);

    //Set up member name
    var memberBio = document.createElement("div");
    memberBio.innerHTML = memeberData.employeebio;
    memberBio.setAttribute("class", "memberBio");
    member.appendChild(memberBio);

    var memberRoles = document.createElement("div");
    memberRoles.setAttribute("class", "memberRoles");
    for(var i = 0; i < memeberData.roles.length; i++) {
        memberRoles.appendChild(CreateRole(memeberData.roles[i]));
    }
    member.appendChild(memberRoles);

    members.appendChild(member);

    return member;
}

function CreateRole(roleData) {
    var memberRole = document.createElement("div");
    var memberId = document.createElement("div");
    memberId.innerHTML = roleData.roleid;
    memberId.setAttribute("class", "roleId");
    memberRole.innerHTML = roleData.rolename;
    memberRole.style.backgroundColor = roleData.rolecolor;
    //For the special case if the color of the background and text are the same (if it is white)
    if (roleData.rolecolor === "#FDFFF7") {
        memberRole.style.color = "#000000";
    }
    memberRole.setAttribute("class", "role");
    memberRole.appendChild(memberId);
    return memberRole;
}

function CreatePagination() {
    //Clear the members
    var members = document.getElementById("members");
    members.innerHTML = "";

    var pagination = document.getElementById("pagination");
    //Clear the pagination
    pagination.innerHTML = "";

    var prevButton = document.createElement("button");
    prevButton.innerHTML = "Prev";
    prevButton.setAttribute("onclick", "ChangePage(\"prev\")");
    prevButton.setAttribute("class", "page");
    pagination.appendChild(prevButton);

    //Create the page button
    var page;
    for (var i = 0; i < membersData.length; i += NUM_MEMBERS_PAGE_LIMIT) {
        //See that we are getting the integer portion
        //console.log(parseInt(i / NUM_MEMBERS_PAGE_LIMIT));
        //Add 1 because as human we do not read the first page as 0
        var pageValue = parseInt(i / NUM_MEMBERS_PAGE_LIMIT) + 1;

        page = document.createElement("button");
        page.innerHTML = pageValue;
        page.setAttribute("onclick", "ChangePage(" + pageValue + ")");
        page.setAttribute("class", "page");
        pagination.appendChild(page);
    }

    var nextButton = document.createElement("button");
    nextButton.innerHTML = "Next";
    nextButton.setAttribute("onclick", "ChangePage(\"next\")");
    nextButton.setAttribute("class", "page");
    pagination.appendChild(nextButton);

    //Start at the first page of list
    for(var i = 0; i < NUM_MEMBERS_PAGE_LIMIT && i < membersData.length; i++) {
        members.appendChild(membersData[i]);
    }
    currentPage = 0;
}

function ToggleRole(roleId) {
    if (rolesFilter.includes(roleId)) {
        //Find the roleId and splice it out
        for (var i = 0; i < rolesFilter.length; i++) {
            if (rolesFilter[i] === roleId) {
                rolesFilter.splice(i, 1);
                break;
            }   
        }
    }
    else {
        rolesFilter.push(roleId);
    }
}

function FilterMembers() {
    var url = "http://sandbox.bittsdevelopment.com/code1/fetchemployees.php";
    if (rolesFilter.length > 1) {
        url += "?roles=" + rolesFilter[0];
        for (var i = 1; i < rolesFilter.length; i++) {
            url += "," + rolesFilter[i]; 
        }
    }
    //Clear the members
    //console.log(url);
    document.getElementById("members").innerHTML = "";
    membersData = new Array();

    nameFilter = document.getElementById("filterName").value;
    //console.log(nameFilter);
    GetMemberData(url);
}

function ChangePage(page) {
    //Clear the members
    var members = document.getElementById("members");
    members.innerHTML = "";
    if (page === "prev") {
        currentPage--;
        if (currentPage === -1) {
            currentPage = 0;
        }
    }
    else if (page === "next") {
        currentPage++;
        if (currentPage * NUM_MEMBERS_PAGE_LIMIT > membersData.length) {
            currentPage = parseInt(membersData.length / NUM_MEMBERS_PAGE_LIMIT);
        }
        else if (currentPage * NUM_MEMBERS_PAGE_LIMIT === membersData.length) {
            currentPage = parseInt(membersData.length / NUM_MEMBERS_PAGE_LIMIT) - 1;
        }
    }
    else {
        currentPage = page - 1;
    }
    for (var i = 0; i < NUM_MEMBERS_PAGE_LIMIT && (currentPage * NUM_MEMBERS_PAGE_LIMIT) + i < membersData.length; i++) {
        members.appendChild(membersData[(currentPage * NUM_MEMBERS_PAGE_LIMIT) + i]);
    }
}