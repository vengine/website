// JavaScript Document

function setTab(name,cursel,n){
for(i=1;i<=n;i++){
var menu=document.getElementById(name+i);
var con=document.getElementById("con_"+name+"_"+i);
menu.className=i==cursel?"hover":"";
con.style.display=i==cursel?"block":"none";
}
}


function showdiv(divnum,divbefor,id){
	for(i=1;i<=divnum;i++){
		try{
			if(i==divbefor){
				document.getElementById(id+i).style.display="inline";
			}else{
				document.getElementById(id+i).style.display="none";
			}
		}catch(e){ }
	}
}
function menuFix(){}