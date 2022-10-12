const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const { Builder, By, key, until } = require('selenium-webdriver');
const { errorResponse, successResponse } = require('../utils/index');
const { sendmail } = require("../utils/mail");

const screen = {
	width: 640,
  height: 480
 };

let errorCounter;
 
let driver = new Builder().forBrowser('chrome').build();
// let driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize(screen)).build();

let globalWindow = driver.getWindowHandle();

const login = async (req, res) => {
	 
	if(errorCounter > 7) {
		sendmail(
      "Parivahan site is not responding",
			`<br><p style="font-size:large"> Hello </p>
			 <p style="font-size:large"> Please take of note this, that <strong>parivahan</strong> site is not responding<p><br>
			 <p style="font-size:large">Thank you</p>`
    );
		console.log("trigger mail sent");
	}
	 try {

			const phoneNumber = ["7383692583", "8795509425", "8290403399", "9727714796", "6355497076"];
			const password = ["vinayak@017", "Aman@1990", "Oneclick1@", "Oneclick1@", "umang@01"];

			let x = Math.random()*5;
			let y = Math.floor(x);

			await driver.switchTo().newWindow('tab');
			await driver.get('https://vahan.parivahan.gov.in/nrservices/faces/user/citizen/citizenlogin.xhtml');	

			let currrentTimestamp = Date.now();
			let windowHandle = await driver.getWindowHandle();
			
				let textEle = await driver.wait(until.elementLocated(By.id("TfMOBILENO")), 2500);
				await textEle.sendKeys(phoneNumber[y]);
				let buttonEle = await driver.wait(until.elementLocated(By.id("btRtoLogin")),500);
				await buttonEle.click();
				
				let textEle1 = await driver.wait(until.elementLocated(By.id("tfPASSWORD")),1000);
				await textEle1.sendKeys(password[y]);
				let buttonEle2 = await driver.wait(until.elementLocated(By.id("btRtoLogin")),500);
				await buttonEle2.click();

				let imageEle = await driver.wait(until.elementLocated(By.id("vahancaptcha:ref_captcha")),2000);
        let encodedString = await imageEle.takeScreenshot(true);

        fs.writeFileSync(`./public/${currrentTimestamp}image.png`, encodedString, 'base64');

				let object = {
					imgUrl: `http://oneclicksales.xyz:3500/${currrentTimestamp}image.png`,
					windowHandle: windowHandle
				}
				
				setTimeout(async() => {
					return successResponse(req, res, object, 200, true);
				}, 1000);


    } catch (error) {
				errorCounter++;
        console.log("Error ==========> ", error.message);
        return successResponse(req, res, "something went wrong", 400, false);
    }
};

const getInfo = async(req, res) => {
	
  	const vehicleNumber = req.params.vehiclenumber;
  	const captcha = req.params.captcha;
		const windowHandle = req.params.windowHandle;
		
		const date = new Date();

		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();
		let hour = date.getHours();
		let minute = date.getMinutes(); 
		let second = date.getSeconds(); 

		let currentDate = `${day}-${month}-${year}`;
		let currentTime = `${hour}:${minute}:${second}`;

		if(!windowHandle) {
			return successResponse(req, res, 'Invalid data', 500, false);
		}

		await driver.switchTo().window(windowHandle);

		let numberElement = await driver.wait(until.elementLocated(By.id("regn_no1_exact")),3000);
		await numberElement.sendKeys(vehicleNumber);
		let captchaElement = await driver.wait(until.elementLocated(By.id("vahancaptcha:CaptchaID")),500);
		await captchaElement.sendKeys(captcha);
		let buttonElement = await driver.wait(until.elementLocated(By.xpath("/html/body/form/div/div[3]/div/div[2]/div/div[1]/div[2]/div[1]/div[5]/div/button")),500);
		await buttonElement.click();

		setTimeout(async() => {
			try{			
								const VehicleNumber = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[1]/table/tbody/tr[1]/td[1]/div")).getText();
                const status = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[1]/table/tbody/tr[1]/td[2]/div/span")).getText();
                const VehicleClass = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[1]/table/tbody/tr[2]/td/div")).getText();
                const type = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[1]/table/tbody/tr[3]/td[1]/div")).getText();
                const emissionNorms = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[1]/table/tbody/tr[3]/td[2]/div")).getText();
                const model = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[1]/table/tbody/tr[4]/td/div/span[1]")).getText();
                const manufacturer = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[1]/table/tbody/tr[4]/td/div/span[2]")).getText();
                const authority = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[1]/table/tbody/tr[4]/td/div/span[3]")).getText();
                const ownerName = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[2]/div[2]")).getText();
                const registrationDate = await driver.findElement(By.xpath('//*[@id="rcDetailsPanel"]/div[2]/div[4]')).getText();
                const fitnessValidity = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[4]/div[2]/span")).getText();
                const MVtaxValidity = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[4]/div[4]")).getText();
                const pucValidity = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[5]/div[2]/span")).getText();
								
								let insuranceCompany, validity, policyNo;

								let rcObject = [];
                rcObject.push({ VehicleNumber, status, VehicleClass, type, emissionNorms, model, manufacturer, authority, ownerName, registrationDate, fitnessValidity, MVtaxValidity, pucValidity });

								try{
									insuranceCompany = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[7]/span[1]")).getText();
									validity = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[7]/span[2]")).getText();
									policyNo = await driver.findElement(By.xpath("//*[@id='rcDetailsPanel']/div[7]/span[3]")).getText();
									rcObject.push({ insuranceCompany, validity, policyNo });
								}
								finally {
									
									if (typeof rcObject.VehicleNumber == undefined) {
                    return successResponse(req, res, "Something went wrong", 404);
                	} else {
										
									await driver.close();
									await driver.switchTo().window(globalWindow);
                  return successResponse(req, res, rcObject, 200, true);
                	}
								}

			} catch(error) {
				errorCounter++;
				console.log(error.message);
				return successResponse(req, res, 'Invalid data', 500, true);
			}

    }, 4000);
};

const terms = (req, res) => {
	try {
		res.render("terms");
	} catch (error) {
		console.log(error.message);
		return errorResponse(req, res, "something went wrong", 500);
	}
};

const privacy = (req, res) => {
	try {
		res.render("privacy");
	} catch (error) {
		console.log(error.message);
		return errorResponse(req, res, "something went wrong", 500);
	}
};


module.exports = { login, getInfo, terms, privacy };