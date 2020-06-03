//Global variables
var members = new Array();

window.onload = OnLoad;

function OnLoad() {
    GetData();
}

async function GetData() {
    var xmlhttp = new XMLHttpRequest();
    var url = "http://sandbox.bittsdevelopment.com/code1/fetchemployees.php";

    xmlhttp.onreadystatechange = function() {
        //When we get the data
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            //myFunction(myArr);
            console.log(myArr);
            //Here we will create all the members
            for(var i = 1; i < Object.keys(myArr).length + 1; i++) {
                CreateMember(myArr[i]);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function CreateMember(memeberData) {
    //Check the member data
    console.log(memeberData);

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
}

function CreateRole(roleData) {
    var memberRole = document.createElement("div");
    memberRole.innerHTML = roleData.rolename;
    memberRole.style.backgroundColor = roleData.rolecolor;
    memberRole.setAttribute("class", "role");
    return memberRole;
}