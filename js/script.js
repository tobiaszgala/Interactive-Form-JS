document.addEventListener('DOMContentLoaded', function () {
    /* CONSTANTS */
    
    // selecting first form on the page
    const form = document.getElementById('main-form');
    // selecting name input field
    const nameInput = document.getElementById('name');
    // selecting email input field
    const emailInput = document.getElementById('mail');
    // selecting drop-down menu for jobRole
    const jobRole = document.getElementById('title');
    // selecting input element for other job role
    const otherJobRole = document.getElementById('other-title');
    // selecting drop-down menu for design section
    const design = document.getElementById('design');
    // selecting color drop-down menu
    const color = document.getElementById('color');
    // selecting "Register for Activities" container
    const activities = document.getElementsByClassName('activities')[0];
    // select element with payment options
    const payment = document.getElementById('payment');
    // get all input fields for credit card
    const ccInputs = document.querySelectorAll('#cc input[type="text"]');
    // selecting all error message divs
    const errorMessageContainer = document.getElementsByClassName('error-message');
    // create h2 element to hold price for activities
    const priceTag = document.createElement('span');
    
    /* 
        Object for design theme options
        Flexible, we can add new items and add array which points to correct options
    */
    const themes = {
        'js puns'  : function() { return selectThemeColors([0,1,2]); },
        'heart js' : function() { return selectThemeColors([3,4,5]); }
    };
    
    /*
        Array of objects for activities
        It is using 24h notation
    */
    const arr_objActivities = [
        { name: document.getElementsByName('all')[0],           price: 200 },
        { name: document.getElementsByName('js-frameworks')[0], price: 100, day: 'Tuesday',   startTime: 9,  endTime: 12 },
        { name: document.getElementsByName('js-libs')[0],       price: 100, day: 'Tuesday',   startTime: 13, endTime: 16 },
        { name: document.getElementsByName('express')[0],       price: 100, day: 'Tuesday',   startTime: 9,  endTime: 12 },
        { name: document.getElementsByName('node')[0],          price: 100, day: 'Tuesday',   startTime: 13, endTime: 16 },
        { name: document.getElementsByName('build-tools')[0],   price: 100, day: 'Wednesday', startTime: 9,  endTime: 12 },
        { name: document.getElementsByName('npm')[0],           price: 100, day: 'Wednesday', startTime: 13, endTime: 16 }
    ];
    
    /*
        Object of payment options
        Flexible, new options can be added pointing to the container
    */
    const paymentOptions = {
        'credit card' : document.getElementById('cc'),
        'paypal'      : document.getElementById('pay-paypal'),
        'bitcoin'     : document.getElementById('pay-bitcoin')
    };
        
    /* GLOBAL VARIABLES */
    
    // Creating object to hold global variables with default values
    const FormGlobal = {
        'isCreditCardValid' : false,
        'isZipValid'        : false,
        'isCVVValid'        : false,
        'activitiesPrice'   : 0
    };
    
   /* FUNCTIONS */
    
    // start-up function
    function initForm() {
        // modify priceTag properties
        priceTag.id = 'price-tag';
        priceTag.textContent = 'Price: $0';
        activities.appendChild(priceTag);
        
        // hide other job role input element and it's label
        toggleView(otherJobRole.previousElementSibling, toggleView(otherJobRole, false));
        // hide color selection and it's label for t-shirt info
        toggleView(color.previousElementSibling, toggleView(color, false));
        // hide divs with payment options
        hidePaymentOptions();
        // hide all error messages
        hideErrors();
        // focus on first input field
        form.querySelector('#name').focus();
        // display default option (credit card)
        toggleView(paymentOptions['credit card'], true);
        // set novalidate attribute to prevent browser validation
        form.setAttribute('novalidate', true);
    }
    
    // function to hide or show specific element
    function toggleView(tag, bool) {
        // set display to default or none of specific element
        tag.style.display = bool ? '' : 'none';
        return bool;
    }
    
    // function to display specific error message for credit card validation
    function setCreditCardErrorMessage(message) {
        // change textContent of error div in credit card options
        errorMessageContainer[3].textContent = message;
    }
    
    // function to hide payment options
    function hidePaymentOptions() {
        // loop through paymentOptions object and set display to none
        for (prop in paymentOptions)
            toggleView(paymentOptions[prop], false);
    }
    
    // function hides all error messages
    function hideErrors() {
        for (let i = 0; i < errorMessageContainer.length; i++) {
            errorMessageContainer[i].style.display = 'none';
        }
    }
    
    // set or reset background of input fields
    function resetBackground(element, bool) {
        bool ? element.style.backgroundColor = '' : element.style.backgroundColor = '#FFD2D2';
    }
    
    // check if there are any errors and display warrning
    function displayErrors() {
        resetBackground(nameInput, validateName());
        toggleView(errorMessageContainer[0], !validateName());
        resetBackground(emailInput, validateEmail());
        toggleView(errorMessageContainer[1], !validateEmail());
        toggleView(errorMessageContainer[2], !validateActivities());
        if (!FormGlobal['isCreditCardValid'] ||
            !FormGlobal['isZipCodeValid'] ||
            !FormGlobal['isCVVValid']) 
        {
            toggleView(errorMessageContainer[3], true);
            setCreditCardErrorMessage("Please correct you credit card information");
            resetBackground(ccInputs[0], FormGlobal['isCreditCardValid']);
            resetBackground(ccInputs[1], FormGlobal['isZipCodeValid']);
            resetBackground(ccInputs[2], FormGlobal['isCVVValid']);
        }
        
    }
    
    // function validates activities and hide those which cannot be taken in the same time
    function compareActivity(obj) {
        // loop through all activities
        for (let i = 0; i < arr_objActivities.length; i++) {
            // if activity exists and is not the same
            if (obj && obj != arr_objActivities[i]) {
                // if activity is different than selected and has:
                    // same day
                    // start time >= selected start time
                    // start time < selected end time
                if (arr_objActivities[i].day === obj.day 
                    && arr_objActivities[i].startTime >= obj.startTime 
                    && arr_objActivities[i].startTime < obj.endTime) 
                {
                    if (obj.name.checked)
                        // if selected activity is checked, set next's option disabled property to true
                        arr_objActivities[i].name.disabled = true;
                    else 
                        // if selected activity is not checked, set next's option disabled property to false
                        arr_objActivities[i].name.disabled = false;   
                }
            }
        }
    }
    
    // function select options for color drop-down menu with a range
    function selectThemeColors(optArr) {
        // sorting array just in case the numbers are not in ascending order
        optArr.sort(function(a, b) { return a - b; });
        // get first requested option
        const first = optArr[0];
        // get max number of options
        const max = color.options.length;
        
        // run loop for all options
        for (let i = 0; i < max; i++) {
            // if option = requested option set it to be visible
            if (toggleView(color.options[i], i === optArr[0]))
                // delete first item from the array to compare next option
                optArr.shift();
        }
        // return first requested option
        return color.options[first];  
    }
    
    // Validation functions
    
    function validateName() {
        // return true if name has value
        return nameInput.value.length > 0 ? true : false;
    }
    
    function validateEmail() {
        // return true if email contains @ symbol
        return emailInput.value.indexOf('@') > -1 ? true : false;
    }
    
    function validateActivities() {
        // check if at least one checkbox is checked
        const checkedActivities = document.querySelector('.activities input:checked');
        // return true if checkbox is checked
        return checkedActivities ? true : false;
    }
    
    // function validates credit card inputs
    function validateCreditCardInputs(inputValue, type) {
        if (type === 'user_cc-num') 
            return FormGlobal['isCreditCardValid'] = 
                // set to true if credit card number is between 13 and 16 numbers
                (!isNaN(inputValue) && inputValue.length >= 13 && inputValue.length <= 16);
        else if (type === 'user_zip')
            return FormGlobal['isZipCodeValid'] = 
                // set to true if zip code is exactly 5 numbers
                (!isNaN(inputValue) && inputValue.length === 5);
        else if (type === 'user_cvv')
            return FormGlobal['isCVVValid'] = 
                // set to true if CVV is exactly 3 numbers
                (!isNaN(inputValue) && inputValue.length === 3);
        else
            return false;
    }
    

    /* EVENT LISTENERS */
    
    nameInput.addEventListener('input', function(e) {
        // show or hide error message if name is empty or not
        toggleView(errorMessageContainer[0], !validateName());
        resetBackground(nameInput, validateName());
    });
    
    nameInput.addEventListener('focus', function(e) {
        // show or hide error message if name is empty or not
        toggleView(errorMessageContainer[0], !validateName());
    });
    
    emailInput.addEventListener('input', function(e) {
        // show or hide error message if email is valid or not
        toggleView(errorMessageContainer[1], !validateEmail());
        resetBackground(emailInput, validateEmail());
    });
    
    emailInput.addEventListener('focus', function(e) {
        // show or hide error message if email is valid or not
        toggleView(errorMessageContainer[1], !validateEmail());
    });
    
    
    jobRole.addEventListener('change', function(e) {
        // if other is selected, display 'other' input field and set focus
        if (toggleView(otherJobRole, e.target.value === 'other'))
            otherJobRole.focus();

    });
    
    // display colors based on theme selection
    design.addEventListener('change', function(e) {
        // get value of target element
        const target = e.target.value;
        
        // show or hide label and select element if property exists
        if (toggleView(color, toggleView(color.previousElementSibling, themes.hasOwnProperty(target))))
            // if property exists, call its function and set first item to selected
            themes[target]().selected = true;
    });
    
    activities.addEventListener('change', function (e) {
        // return first matching object from array of activities objects
        const targetObj = arr_objActivities.filter(function(activities) {
             return activities.name === e.target;
        })[0];
        
        // if object is checked = add price else adjust price
        FormGlobal['activitiesPrice'] += e.target.checked ? targetObj.price : -targetObj.price;
        // display price
        priceTag.textContent = 'Price: $' + FormGlobal['activitiesPrice'];
        // check if there are other activities within the same time
        compareActivity(targetObj);
        // display error if nothing is selected
        toggleView(errorMessageContainer[2], !validateActivities());
    });
    
    payment.addEventListener('change', function(e) {
        // reset options if something is selected
        hidePaymentOptions();
        // if selected option exists, display content
        if (paymentOptions.hasOwnProperty(e.target.value))
            toggleView(paymentOptions[e.target.value], true);
    });
    
    // when focused on specific credit card field, display message
    paymentOptions['credit card'].addEventListener('focusin', function(e) {
        if (e.target.name === 'user_cc-num') {
            setCreditCardErrorMessage('Credit card number must be between 13 and 16 characters');
        } else if (e.target.name === 'user_zip')
            setCreditCardErrorMessage('Zip code field should have 5-digit number');
        else if (e.target.name === 'user_cvv')
            setCreditCardErrorMessage('CVV field should have 3-digit number');
        /*
            hide/show error message
            Note: This validation helps us when we come back from different field
        */
        toggleView(errorMessageContainer[3], !validateCreditCardInputs(e.target.value, e.target.name));
    });
    
    paymentOptions['credit card'].addEventListener('input', function(e) {
        // hide/show error message
        toggleView(errorMessageContainer[3], !validateCreditCardInputs(e.target.value, e.target.name));
        resetBackground(e.target, validateCreditCardInputs(e.target.value, e.target.name));
        
    });
    
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // display if there are any errors
        displayErrors();
        // check if name, email is valid and at least on activity is selected
         if (validateName() && validateEmail() && validateActivities()) {
            // if everything is valid check if credit card option is selected
             if (payment.options[1].selected) {
                 // if credit card option is selected check if all fields are valid
                 if (FormGlobal['isCreditCardValid'] && FormGlobal['isZipCodeValid'] && FormGlobal['isCVVValid'])
                    // if all fields are valid including credit card section submit form
                    e.target.submit();
             } else
                /*
                    if name, email and number of activities is valid 
                    but no credit card payment option is selected 
                    submit form
                */
                 e.target.submit();
         }
    });
    
    // on page load
    initForm();
});