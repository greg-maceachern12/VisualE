export const disableButton = (state) => {
    if (state === true)
        document.getElementById("Button").disabled = true;
    else
        document.getElementById("Button").disabled = false;
  };