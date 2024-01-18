exports.generateOTP = ()=>{
    let otp = ''
 for(let i=0;i<=3;i++){
           const randval = Math.round(Math.random()*9)
           otp = otp + randval
       }
       return otp;
   
}

exports.generateEmailTemplate = code =>{
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
   
    <title>React App</title>
  </head>
  <body>
   
<div>
<a>${code}<a/>
<div/>

      
  </body>
</html>

    `
}
