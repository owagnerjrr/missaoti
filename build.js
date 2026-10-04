const fs=require('fs');fs.rmSync('dist',{recursive:true,force:true});fs.cpSync('public','dist',{recursive:true});
