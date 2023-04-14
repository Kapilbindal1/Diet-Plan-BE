const textFormatting = (str) =>
  str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();

function htmlTemplate({ name, dietPlan }) {
  let keyArr = Object.keys(dietPlan);

  

  let stringArr =  keyArr.map((item, i) => {
    const {
      meal,
      nutrition: { proteins, fats, carbs, calories },
    } = dietPlan[item];

    return `
        <td style="width:50%">
        <div style="border: 1px solid black;
        padding: 15px;
        border-radius: 20px;    margin: 20px;">
          <h3 style="margin:0px">${textFormatting(keyArr[i].replace("_"," "))} <span style="float:right;font-weight: 500;font-size:15px">Calories:<span style="color: #e3664f;font-weight: normal;">${calories}</span></h3>
          <h4 style="font-size: 15px;margin-bottom: 15px;">Meal Name: <span style="font-weight: 500;font-size: 14px;">${meal}</span>
          </h4>
          <h5 style="margin-bottom:0px;margin-top: 15px;">Macronutrients Breakup</h5>
          <p style="display: inline-block;margin-top: 4px;">Protein:<span style="margin:0 5px ;color: #e3664f">${proteins}</span></p>
          <p style="display: inline-block;margin-top: 4px">Fats:<span style="margin:0 5px;color: #e3664f">${fats}</span></p>
          <p style="display: inline-block;margin-top: 4px">Carbs:<span style="margin:0 5px;color: #e3664f">${carbs}</span></p>
        </div>
        </td>
        `;
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Diet Plan</title>
      <style>
        body {
          font-family: 'Roboto', sans-serif;
        }
        p{
          font-size: 14px;
        }
      </style>
    </head>
    <body>
        <table width="576"  cellpadding="0" cellspacing="0">
            <table width="100%">
                <tr>
                    <td align="center">
                        <table width="576" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">
                            <tbody>
                            <tr>
                                <td style="text-align: center;">
                                        <img src="https://i.ibb.co/x6pJLHJ/Group-54138-1.jpg" style="width: 150px;" alt="Diet Plan">
                                </td>
                            
                            </tr>
        
                        </tbody></table>
                    </td>
                </tr>
            </table>
            <table width="100%">
                <tr>
                    <td align="center">
                        <table  width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin:0px 20px">
                            <tbody> 
                  <tr>
                    <th colspan="2"><h1>${textFormatting(name)}'s Custom Diet plan</h1></th>
                  </tr> 
                  <tr> 
                    ${stringArr.slice(0,2).join("")}
                  </tr>
                  <tr> 
                  ${stringArr.slice(2,4).join("")}
                  </tr>
                  <tr>
                  ${stringArr.slice(4).join("")}
                    <td style="width:50%">
                      <div style="border: 1px solid black;
                      padding: 15px;
                      border-radius: 20px;    margin: 20px;">
                        <h3 style="margin:0px">Diet Notes</h3>
                        <p>3-4 liters of <span style="margin:0 5px;color: #e3664f">Water</span> </p>
                        <p >More green <span style="margin:0 5px;color: #e3664f">Veggies</span> </p>
                        <p >10 mins <span style="margin:0 5px;color: #e3664f">Meditation</span> </p>
                        <p >45 mins of <span style="margin:0 5px;color: #e3664f">Exercise</span> </p>
                        <p >08 hrs of <span style="margin:0 5px;color: #e3664f">Sleep</span></p>
                        <p >10,000 <span style="margin:0 5px;color: #e3664f">Steps/day</span></p>
                      </div>
                    </td>
                  </tr>
                        </tbody></table>
                    </td>
                </tr>
            </table>
        </table>
    </body>
    </html>
    
    `;
}

module.exports = { htmlTemplate };
