# herbalife
Contains an excercise for an interview, a shopping cart in KendoUI with the following specs:

- Take the JSON structure and display the data using a Kendo List View (The JSON data should be used in a Kendo Data Source).
- Add a decrease quantity button, a quantity input and an increase quantity button, for every row.
- Generate a cart section, where only totals should be displayed.
 *If the user clicks at the add quantity button or the user enter a quantity into the quantity input, the cart total products and total price should be increase and product stock should be decrease.
 *If the user clicks at the decrease quantity button (-), the total of the products in the cart and the total price must be decreased,  as per the product stock should be increase.
 *Use a Kendo Data Source, to store the items that were added/removed into the cart.
 *Only available products can be added into cart.
 *If the Cart has no Items, kendo data source should be empty.
 *Add the proper validations for every math operation.
 *Display error message as per convenience.
-Feel free to style as you desire.
-In the cart section, add a button ('View Items'). Once user hits it, a popup should be displayed (Use a Kendo Modal).
-This popup should display the items added into the cart.
-In the cart section, add a button ('Clean Cart'). Once user hits it, the cart must be cleaned.
