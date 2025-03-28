Nof1.SET_SEED("42");
let n = new Nof1.Nouns();

let random_word = n.words[Nof1.new_random_integer(n.words.length)];

// Global array to store the generated if-else structures
let generated_if_else_structures = [];
let structureIndex = 0; // Index to track the next structure to use
let test_arr = [];
let arr_of_random_names = [];
let arr_of_returned_values = [];
let methodCounter = 0;  // Global method counter to ensure unique method names
let correctAnswer = 0;
let arr_jump_over = []
let body_return_values = []


function create_true_false_combinations(length, arr, store) {
    if (length === 0) store.push([...arr]);
    else {
        let new_array = [...arr];
        new_array.push(false);
        create_true_false_combinations(length - 1, new_array, store);

        new_array = [...arr];
        new_array.push(true);
        create_true_false_combinations(length - 1, new_array, store);
    }
}

class TreeNode {
    indentation(level) {
        return " ".repeat(level * 4);
    }
}

class Tree extends TreeNode {
    condition = null;
    then = null;
    else = null;

    jump_over() {
        if(this.condition===true)
            return 1 + this.then.jump_over();
        else
            return 1 + this.then.lines_of_code() + 1 + this.else.jump_over();
    }

    lines_of_code() {
        return 3 + this.then.lines_of_code() + this.else.lines_of_code();
    }



    number_of_nodes() {
        let ret = 1;
        if (this.then !== null) ret += this.then.number_of_nodes();
        if (this.else !== null) ret += this.else.number_of_nodes();
        return ret;
    }

    number_of_ifs() {
        let ret = 1;
        if (this.then !== null) ret += this.then.number_of_ifs();
        if (this.else !== null) ret += this.else.number_of_ifs();
        return ret;
    }

    print_into_stream(arr, level) {
        arr.push(this.indentation(level) + "if(" + this.condition + ") {\n");

        if (this.then !== null) {
            this.then.print_into_stream(arr, level + 1);
        }

        arr.push(this.indentation(level) + "} else {\n");

        if (this.else !== null) {
            this.else.print_into_stream(arr, level + 1);
        }

        arr.push(this.indentation(level) + "}\n");
    }

    init_from_true_false_combination(combination_array) {
        this.condition = combination_array.shift();

        if (this.then !== null) this.then.init_from_true_false_combination(combination_array);
        if (this.else !== null) this.else.init_from_true_false_combination(combination_array);
    }

    clone() {
        let ret = new Tree();
        ret.condition = this.condition;

        if (this.then !== null) ret.then = this.then.clone();
        if (this.else !== null) ret.else = this.else.clone();

        return ret;
    }
}

// Helper functions
function randomBoolean() {
    return Math.random() < 0.5;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomName() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let name = '';
    for (let i = 0; i < 2; i++) {
        name += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return name;
}

function randomNames() {
    random_word = n.words[Nof1.new_random_integer(n.words.length)];
    return random_word;
}

function indentation(level) {
    return " ".repeat(level * 4);
}

function generate_if_else_structure(arr, level, answer_arr) {
    const condition1 = randomBoolean();
    const condition2 = randomBoolean();
    const returnValue1 = randomInteger(1, 9);
    const returnValue2 = randomInteger(1, 9);
    const returnValue3 = randomInteger(1, 9);

    arr.push(indentation(level) + `if (${condition1}) {\n`);
    arr.push(indentation(level + 1) + `if (${condition2}) {\n`);
    arr.push(indentation(level + 2) + `return ${returnValue1};\n`);
    arr.push(indentation(level + 1) + `} else {\n`);
    arr.push(indentation(level + 2) + `return ${returnValue2};\n`);
    arr.push(indentation(level + 1) + `}\n`);
    arr.push(indentation(level) + `} else {\n`);
    arr.push(indentation(level + 1) + `return ${returnValue3};\n`);
    arr.push(indentation(level) + `}\n`);

    // Determine the actual returned value
    let finalMethodReturnValue;
    if (condition1) {
        if (condition2) {
            finalMethodReturnValue = returnValue1;
        } else {
            finalMethodReturnValue = returnValue2;
        }
    } else {
        finalMethodReturnValue = returnValue3;
    }

    test_arr.push(finalMethodReturnValue); // Collecting the return value
    //arr.push(`// This method returns ${finalMethodReturnValue}.\n`); // Add comment about the return value


    // Save the structure to the global array
    generated_if_else_structures.push({
        structure: arr.join(""), // Store the entire generated structure as a string
        returnValue: finalMethodReturnValue // Store the computed return value
    });



    return finalMethodReturnValue; // Return the final return value
}

class Return extends TreeNode {
    constructor(useRandomName = false) {
        super();
        this.useRandomName = useRandomName;
        this.returnBody = returnBody;
        this.name = this.useRandomName ? randomNames() : null;
        this.body = null;
    }

    number_of_nodes() {
        return 1;
    }

    jump_over() {
        return 1;
    }

    lines_of_code() {
        return 1;
    }


    number_of_ifs() {
        return 0;
    }

    print_into_stream(arr, level) {
        if(returnBody == false){
            let random_name = this.name;
            arr_of_random_names.push(random_name);
            arr.push(this.indentation(level) + "return " + random_name + "();" + "\n");
        }
        else{
            console.log("test")
            let generatedStructure = [];
            generate_if_else_structure(generatedStructure, level, test_arr);
            console.log("test arr: ", test_arr)
            arr.push(generatedStructure.join(""));
            // arr.push(this.indentation(level) + "test" + "\n");
        }

    }

    init_from_true_false_combination(arr) {
        // No action needed
    }

    clone() {
        let ret = new Return(this.useRandomName);
        ret.name = this.name;

        if (this.body !== null) ret.body = this.body.clone();

        return ret;
    }

    set_name_from_return_value(value) {
        if (!this.useRandomName) {
            methodCounter++; // Increment the global method counter
            this.name = `${randomNames()}_returns_${value}`; // Name based on the return value
        }
    }
}

function create_balanced_tree(depth) {
    let tree = new Tree();

    if (depth > 1) {
        tree.then = create_balanced_tree(depth - 1);
        tree.else = create_balanced_tree(depth - 1);
    }

    return tree;
}

function replace_inner_nodes_at_depth(tree, depth, useRandomName) {
    if (depth === 0) {
        tree.then = new Return(useRandomName);
        tree.then.body = create_balanced_tree(2);
        tree.else = new Return(useRandomName);
        tree.else.body = create_balanced_tree(2);

        if (!useRandomName) {
            let arr = [];
            let returnValue1 = generate_if_else_structure(arr, 1, test_arr);
            tree.then.set_name_from_return_value(returnValue1); // Correctly set the name based on return value

            arr = [];
            let returnValue2 = generate_if_else_structure(arr, 1, test_arr);
            tree.else.set_name_from_return_value(returnValue2); // Correctly set the name based on return value
        }
    } else {
        replace_inner_nodes_at_depth(tree.then, depth - 1, useRandomName);
        replace_inner_nodes_at_depth(tree.else, depth - 1, useRandomName);
    }
}

function create_true_false_ifs(tree) {
    let all_true_false_combinations = [];
    create_true_false_combinations(tree.number_of_ifs(), [], all_true_false_combinations);

    let all_true_false_trees = [];

    for (let comb of all_true_false_combinations) {
        let new_tree = tree.clone();
        new_tree.init_from_true_false_combination(comb);
        all_true_false_trees.push(new_tree);
    }

    return all_true_false_trees;
}

function create_true_false_if_trees(height, useRandomName) {
    let proto_tree = create_balanced_tree(height);
    replace_inner_nodes_at_depth(proto_tree, height - 1, useRandomName);
    return create_true_false_ifs(proto_tree);
}

// Method to compute the return value by traversing the tree and count nodes traversed, Also computes final return value of the entire code (TO BE CHECKED, TO BE CHECKED)
function computeReturnValue(tree) {
    let totalCount = 0
    let returnNodeCount = 0; // New counter for Return nodes

// Recursive function to traverse the tree and compute the return value
    function traverse(node, nodeIndex = 0) {
        totalCount++; // Increment the counter for each node traversed

        if (node instanceof Return) {
            // If the node is a Return instance
            // Increment the counter for Return nodes
            returnNodeCount++;

            if (returnBody === true) {
                // If returnBody is true, return the corresponding value from test_arr
                // console.log("Returning value from test_arr at index " + nodeIndex +":" + test_arr[nodeIndex]);
                if(nodeIndex === 11){
                    return test_arr[5];
                }
                else if(nodeIndex === 7){
                    return test_arr[3];
                }
                else if(nodeIndex === 3){
                    return test_arr[0];
                }
                else{
                    let test_arr_value = nodeIndex - totalCount - 1
                    console.log("Test arr value: " + test_arr_value);
                    return test_arr[test_arr_value];
                }

            } else {
                // Otherwise, return the method name as a string
                totalCount++;
                return node.name + "()";
            }
        } else if (node instanceof Tree) {
            // Check the condition at the current node
            const conditionValue = node.condition;

            if (conditionValue) {
                // If condition is true, traverse the 'then' branch
                return traverse(node.then, nodeIndex + 1);
            } else {
                // If condition is false, traverse the 'else' branch
                const offset = node.then ? node.then.number_of_nodes() : 0;
                console.log("offset: ", offset);
                return traverse(node.else, nodeIndex + 1 + offset);
            }
        } else {
            throw new Error("Unexpected node type encountered.");
        }
    }


    // Start traversing from the root of the tree
    const finalMethodCall = traverse(tree);
    totalCount--;

    console.log(`Total nodes traversed: ${totalCount}`);

    let finalReturnValue;

    // Find the corresponding generated structure and count traversed nodes

    if(returnBody === false){

        // Check if the generated method names match the final method call
        const cleanFinalMethodCall = finalMethodCall.replace(/\(|\)/g, '');
        generated_if_else_structures.forEach((entry, index) => {
            let methodName = arr_of_random_names[index];

            if (methodName == cleanFinalMethodCall) {
                console.log(`Evaluating method ${methodName}()`);
                finalReturnValue = entry.returnValue;
                correctAnswer = finalReturnValue;
                console.log("This code returns: " , entry.returnValue);
            }
        });
    }


    return{
        returnValue: finalMethodCall,
        totalCount: totalCount,
        // correctAnswer: finalReturnValue
        correctAnswer: finalReturnValue
    }

    // returnValue; // Return the final return value
}

//Count the nodes traversed in the method calls
function traverseAndCountNodes(ifElseStructure, totalCount) {
    const lines = ifElseStructure.split("\n");
    const count_return = 1
    let nodeCount = 0 + count_return;
    let skipStack = []; // Track if we should skip the current block of code

    for (let line of lines) {
        line = line.trim();

        // Process "if" statements
        if (line.startsWith("if (")) {
            const condition = line.match(/if\s*\((.*)\)/)[1];
            const conditionValue = eval(condition); // Evaluate the condition

            nodeCount++; // Increment node count for the "if" condition
            skipStack.push(!conditionValue); // Push whether to skip the next branch based on the condition
        }
        // Process "else" statements
        else if (line.startsWith("else")) {
            if (skipStack.length > 0) {
                skipStack[skipStack.length - 1] = !skipStack[skipStack.length - 1]; // Flip the skip flag for the current block
            }
        }
        // Process "return" statements
        else if (line.startsWith("return")) {
            // If the current block is not skipped, increment node count and return
            if (!skipStack[skipStack.length - 1]) {
                nodeCount++;
                break;
            }
        }

        // Handle closing braces
        if (line === "}") {
            skipStack.pop(); // Exit the current block
        }
    }

    // console.log(`Nodes traversed before returning: ${nodeCount}`);
    //console.log("===============================")
    return nodeCount;
}

// let useRandomName = Nof1.new_random_integer(2) == 0;

function generate_methods_for_names(namesArray, useRandomName) {
    let methods = [];

    namesArray.forEach((name) => {
        let arr = [];
        arr.push(name + "() {\n");

        if (!useRandomName) {
            // Ensure we call the next structure in order
            if (structureIndex <= generated_if_else_structures.length) {
                arr.push(generated_if_else_structures[structureIndex].structure); // Call structure in order
                structureIndex++; // Move to the next structure
            } else {
                console.warn("No more generated structures available.");
            }
        } else {
            generate_if_else_structure(arr, 1, arr_of_returned_values);
        }

        arr.push("}.\n");
        methods.push(arr.join(""));

    });
    structureIndex = 0;
    return methods;
}


// Construct the HTML tables
function createTableHTML(tableContent, tableContent_2) {
    let tableHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="width: 30%; border: 1px solid black;">
                <table border="0" style="width:100%; border-collapse:collapse; text-align:left;">
                    <thead>
                        <tr>
                            <th>Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableContent}
                    </tbody>
                </table>
            </div>
            <div style="width: 65%; border: 1px solid black; height: auto;">
                <table border="1" style="width:100%; border-collapse:collapse; text-align:left;">
                    <thead>
                        <tr>
                            <th>Method Definition</th>
                        </tr>
                    </thead>
                   <tbody>
                        <tr>
                            <td colspan="4" style="padding: 10px;">
                                <!-- Flex container for the method call boxes -->
                                <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-start;">
                                    ${tableContent_2}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return tableHTML;
}


// Construct the HTML tables
function createTableHTML_NONE(tableContent, tableContent_2) {
    let tableHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="width: 50%; border: 1px solid black;">
                <table border="0" style="width:100%; border-collapse:collapse; text-align:left;">
                    <thead>
                        <tr>
                            <th>Code Part 1</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableContent}
                    </tbody>
                </table>
            </div>
            <div style="width: 50%; border: 1px solid black; height: auto;">
                <table border="0" style="width:100%; border-collapse:collapse; text-align:left;">
                    <thead>
                        <tr>
                            <th>Code Part 2</th>
                        </tr>
                    </thead>
                   <tbody>
                        <tr>
                            <td colspan="4" style="padding: 10px;">
                                <!-- Flex container for the method call boxes -->
                                <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-start;">
                                    ${tableContent_2}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return tableHTML;
}



let value_of_true_false_combination = Nof1.new_random_integer(127);  //32768
// let useRandomName = Nof1.new_random_integer(2) == 0;
let returnBody = Nof1.new_random_integer(2) == 0;

// let arr = [];
// test_arr  = []
// let all_true_false_trees = create_true_false_if_trees(3, useRandomName);
// all_true_false_trees[value_of_true_false_combination].print_into_stream(arr, 0);
// console.log(arr.join(""))
// console.log("test arr ", test_arr)
//
// console.log(computeReturnValue(all_true_false_trees[value_of_true_false_combination]))
// console.log(computeReturnValue(all_true_false_trees[value_of_true_false_combination]).correctAnswer)



function check_jump_over_4(tree){
    // console.log("Before: ", tree[value_of_true_false_combination].jump_over())
    // console.log("Value before: ", value_of_true_false_combination)

    if((tree[value_of_true_false_combination].jump_over() != 4)){
        value_of_true_false_combination = Nof1.new_random_integer(127);
        tree[value_of_true_false_combination];
        // print("No equals 4" )
        check_jump_over_4(tree)
    }

    else{
        // print("equals")
        return value_of_true_false_combination;
    }
    // console.log("After: ", tree[value_of_true_false_combination].jump_over())
    // console.log("Value after: ", value_of_true_false_combination)

    return value_of_true_false_combination;
}

function check_jump_over_12(tree){
    // console.log("Before: ", tree[value_of_true_false_combination].jump_over())
    // console.log("Value before: ", value_of_true_false_combination)

    if ((tree[value_of_true_false_combination].jump_over() != 12)){
        value_of_true_false_combination = Nof1.new_random_integer(127);
        tree[value_of_true_false_combination];
        // console.log(("No equals 12"));
        check_jump_over_12(tree)
    }

    else{
        // print("equals")
        return value_of_true_false_combination;
    }
    // console.log("Jump Over after : ", tree[value_of_true_false_combination].jump_over())
    // console.log("Value after: ", value_of_true_false_combination)

    return value_of_true_false_combination;
}

function check_jump_over_20(tree){
    // console.log("Before: ", tree[value_of_true_false_combination].jump_over())
    // console.log("Value before: ", value_of_true_false_combination)

    if ((tree[value_of_true_false_combination].jump_over() != 20)){
        value_of_true_false_combination = Nof1.new_random_integer(127);
        tree[value_of_true_false_combination];
        // console.log(("No equals 20"));
        check_jump_over_20(tree)
    }

    else{
        // print("equals")
        return value_of_true_false_combination;
    }
    // console.log("After: ", tree[value_of_true_false_combination].jump_over())
    // console.log("Value after: ", value_of_true_false_combination)

    return value_of_true_false_combination;
}



let experiment_configuration_function = (writer) => {
    return {
        experiment_name: "Nyuyyu First Trial",
        seed: "42",
        introduction_pages: [
            () => writer.print_string_on_stage("Press [Return] to enter the training phase.")
        ],

        pre_run_training_instructions: writer.string_page_command(
            "You entered the training phase. In the training phase, you get a random set of tasks, either with method calls that have good names or method calls with bad names.<br><br>" +
            "<b>To avoid the need for scrolling, please adjust your browser's zoom level to at least 70% and conduct the experiment in full screen mode ([F11])</b>.<br><br>" +
            "Please, run the training until you feel familiar with the experiment. This could be - for example - the case when you correctly answered the tasks 10 times.<br><br>" +
            "You can interrupt the training phase by pressing [ESC]. Otherwise, the training phase will be repeated.<br><br>" +
            "<b>Note that you can see that you are in the training phase (top, right of the screen says <code>Training</code>)</b><br><br>" +
            "Note that you give a response to a question by pressing [0], [1], [2], [3], [4], [5], [6] ,[7], [8] or [9]."
        ),

        pre_run_instruction: writer.string_page_command(
            writer.convert_string_to_html_string(
                "You entered the experiment phase."
            )),


        pre_run_experiment_instructions: writer.string_page_command(
            writer.convert_string_to_html_string(
                "You entered the experiment phase."
            )),


        post_questionnaire: [
            Nof1.alternatives("Age", "What's your age??",
                ["younger than 18", "between 18 and (excluding) 25", "between 25 and (excluding) 30", "between 30 and (excluding) 35", "between 35 and (excluding) 40", "40 or older"]),

            Nof1.alternatives("Status", "What is your current working status?",
                ["Undergraduate student (BSc not yet finished)", "Graduate student (at least BSc finished)", "PhD student", "Professional software developer", "Teacher", "Other"]),

            Nof1.alternatives("Studies", "In case you study, what's your subject?",
                ["I do not study", "Computer science", "computer science related (such as information systems, aka WiInf)", "something else in natural sciences", "something else"]),

            Nof1.alternatives("YearsOfExperience", "How many years of experience do you have in software industry?",
                ["none", "less than or equal 1 year", "more than 1 year, but less than or equal 3 years", "more than 3 years, but less than or equal 5 year", "more than 5 years"]),

            Nof1.alternatives("impression", "What statement describes " +
                "                       best your impression \n\ of the experiment?", [
                "I do not think that there was a difference between the good identifiers and the bad ones",
                "The method names with the return value of the method made it easier for me",
            ])
        ],

        finish_pages: [
            writer.string_page_command(
                "Thanks for participating. When you press [Enter], the experiment's data will be downloaded.\n\n" +
                "Please send your data to stefan.hanenberg@uni-due.de and olive.tatah@uni-due.de.\n\n" +
                "Best,\n" +
                "Nyuyyu")],

        layout: [
            {variable: "Identifier", treatments: ["Good", "Bad", "None"]},
            {variable: "Jump_Over", treatments: ["4", "12", "20"]},

        ],
        repetitions: 7,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        measurement: Nof1.Reaction_time(Nof1.keys(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])),
        task_configuration: (t) => {



            // Equally have method names with bad and good identifiers
            let useRandomName = Nof1.new_random_integer(2) == 0;
            // let returnBody = Nof1.new_random_integer(2) == 0;


            if (t.treatment_value("Identifier") == "Good") // fragt, ob das Treatement Wert "Good" hat
                useRandomName = false;
            else
                useRandomName = true;


            t.do_print_task = () => {
                writer.clear_stage();

                // writer.print_html_on_stage("Say Hello, " + t.treatment_value("Jump_Over") + " Identifier: " + t.treatment_value("Identifier") );
                console.log("Say Hello, " + t.treatment_value("Jump_Over") + " Identifier: " + t.treatment_value("Identifier"))

                let arr = [];
                // Value of true/false combinations


                let all_true_false_trees = create_true_false_if_trees(3, useRandomName);
                console.log(value_of_true_false_combination)


                //Conditions for Treatmeant Identifier
                if(t.treatment_value("Identifier") == "None"){

                    // console.log("Return Body Before: ", value_of_true_false_combination)
                    returnBody = true;

                    console.log("Value of True/False before jumpover: ", value_of_true_false_combination);
                    console.log("Test arr before jumpover: ", test_arr);
                    if (t.treatment_value("Jump_Over") == "4"){
                        console.log("Treatment 4??: ", t.treatment_value("Jump_Over"))
                        this_value = check_jump_over_4(all_true_false_trees)
                    }
                    else if(t.treatment_value("Jump_Over") == "12"){
                        console.log("Treatment 12??: ", t.treatment_value("Jump_Over"))
                        this_value = check_jump_over_12(all_true_false_trees)
                    }
                    else{
                        console.log("Treatment 20??: ", t.treatment_value("Jump_Over"))
                        this_value = check_jump_over_20(all_true_false_trees)

                    }
                    arr = []
                    test_arr = []
                    generated_if_else_structures = []


                    tree = all_true_false_trees[value_of_true_false_combination].print_into_stream(arr, 0);
                    console.log(returnBody)
                    console.log("Array length: ", arr.length)
                    arr.splice(14,0,"")
                    arr_part_1 = arr.slice(0,14)
                    arr_part_2 = arr.slice(14,29)
                    // console.log("Array at 14: ", arr[14])
                    // console.log("Array at 15: ", arr[15])
                    console.log(arr.join(""))



                    let HTML_String = arr_part_1.join("") ;

                    let HTML_String_2 = arr_part_2.join("") ;


                    // Convert the HTML_String into table rows
                    let tableContent = HTML_String.split("\n")
                        .filter(line => line.trim() !== "") // Remove empty lines
                        .map(line => `<tr><td><code>${writer.convert_string_to_html_string(line)}</code></td></tr>`)
                        .join(""); // Create a single string of table rows

                    // Convert the HTML_String into table rows
                    let tableContent_2 = HTML_String_2.split("\n")
                        .filter(line => line.trim() !== "") // Remove empty lines
                        .map(line => `<tr><td><code>${writer.convert_string_to_html_string(line)}</code></td></tr>`)
                        .join(""); // Create a single string of table rows


                    let tableHTML = createTableHTML_NONE(tableContent, tableContent_2);

                    console.log("Answer :",  computeReturnValue(all_true_false_trees[value_of_true_false_combination]).returnValue);
                    t.expected_answer = computeReturnValue(all_true_false_trees[value_of_true_false_combination]).returnValue;

                    test_arr = [];
                    console.log("Array of random names length: ", arr_of_random_names)
                    arr_of_random_names = [];
                    console.log("Array of generated_if_else_structures length: ", generated_if_else_structures.length)
                    generated_if_else_structures = []

                    writer.print_html_on_stage(tableHTML);
                
                }
                else {
                    console.log("Treatment 4??: ", t.treatment_value("Identifier"));

                    console.log("Array of generated_if_else_structures length: ", generated_if_else_structures.length)

                    console.log("Array of random names length: ", arr_of_random_names)
                    arr_of_random_names = [];

                    console.log(useRandomName)
                    console.log("Treatment 4??: ", t.treatment_value("Identifier"));
                    returnBody = false;
                    let this_value = 0;

                    if (t.treatment_value("Jump_Over") == "4"){
                        console.log("Treatment 4??: ", t.treatment_value("Jump_Over"))
                        this_value = check_jump_over_4(all_true_false_trees)
                    }
                    else if(t.treatment_value("Jump_Over") == "12"){
                        console.log("Treatment 12??: ", t.treatment_value("Jump_Over"))
                        this_value = check_jump_over_12(all_true_false_trees)
                    }
                    else{
                        console.log("Treatment 20??: ", t.treatment_value("Jump_Over"))
                        this_value = check_jump_over_20(all_true_false_trees)

                    }

                    console.log("Value of true false after jover: ", this_value)
                    all_true_false_trees[this_value].print_into_stream(arr, 0);
                    console.log(arr.join(""))


                    let HTML_String = arr.join("");


                    // Generate methods based on names
                    let generatedMethods = generate_methods_for_names(arr_of_random_names,useRandomName);
                    console.log("Generated Methods:\n", generatedMethods.join("\n"));

                    console.log("Array of random names length: ", arr_of_random_names)
                    // arr_of_random_names = [];

                    let HTML_String_2 = generatedMethods.join("\n");

                    console.log("Array of generated_if_else_structures length: ", generated_if_else_structures.length)

                    let read_Good = computeReturnValue(all_true_false_trees[value_of_true_false_combination])

                    // Compute the final return value for the first tree
                    let finalMethodCall = read_Good;

                    let read_Bad = 5;

                    // Assuming 'generated_if_else_structures' contains our generated structures
                    generated_if_else_structures.forEach((entry, index) => {
                        let methodName = arr_of_random_names[index];

                        let clean_FinalMethodCall = finalMethodCall.returnValue.replace(/\(|\)/g, '');

                        if (clean_FinalMethodCall === methodName) {
                            read_Bad += traverseAndCountNodes(entry.structure, read_Good.totalCount) + read_Good.totalCount;
                        }
                        traverseAndCountNodes(entry.structure, read_Good.totalCount);
                    });


                    let diff = read_Bad - read_Good.totalCount;

                    t.final_method_call = finalMethodCall.returnValue;



                    t.expected_answer = read_Good.correctAnswer;

                    //Empty the arrays after each task
                    test_arr = [];
                    arr_of_random_names = [];
                    methodCounter = 0;
                    generated_if_else_structures = [];

                    // Convert the HTML_String into table rows
                    let tableContent = HTML_String.split("\n")
                        .filter(line => line.trim() !== "") // Remove empty lines
                        .map(line => `<tr><td><code>${writer.convert_string_to_html_string(line)}</code></td></tr>`)
                        .join(""); // Create a single string of table rows

                    // Convert the HTML_String_2 into table rows (4 rows max for Method Calls)
                    let tableContent_2 = HTML_String_2.split(".")
                        .filter(line => line.trim() !== "") // Remove empty lines
                        .map(line => {
                            // Each method call will be in a smaller box
                            return `<div style="width: 24%; padding: 10px; text-align: left; vertical-align: top; box-sizing: border-box; border: 1px solid black;">
                                <code>${writer.convert_string_to_html_string(line.trim())}</code>
                            </div>`;
                        })
                        .join(""); // Create a single string of table rows

                    let tableHTML = createTableHTML(tableContent, tableContent_2);


                    writer.print_html_on_stage(tableHTML);
                  
                }

            };


            t.given_answer =  writer.print_html_on_stage(
                "<input type=\"text\">"
            );

            t.do_print_after_task_information = () => {

                writer.clear_stage();

                if(t.treatment_value("Identifier") == "None") {


                    if(t.given_answer == t.expected_answer){
                        writer.print_html_on_stage("Correct! This right answer is " + t.given_answer + ".")
                        console.log("Given Answer If: " + t.given_answer)
                    }
                    else{
                        writer.print_html_on_stage("Incorrect! Your input was " + t.given_answer + ".")
                        writer.print_html_on_stage("The right answer is "+ t.expected_answer + "." + "\n\n");
                    }

                    writer.print_string_on_stage(writer.convert_string_to_html_string(
                        "In case, you feel not concentrated enough, take a short break.\n\n" +
                        "Press [Enter] to go on. "));
                }
                else{
                    if(t.given_answer == t.expected_answer){
                        writer.print_html_on_stage("Correct! This right answer is " + t.given_answer + ".")
                        console.log("Given Answer If: " + t.given_answer)
                    }
                    else{
                        writer.print_html_on_stage("Incorrect! Your input was " + t.given_answer + ".")
                        writer.print_html_on_stage("The right answer is "+ t.expected_answer +". It is the output of the function " +  t.final_method_call + "." + "\n\n");
                    }

                    writer.print_string_on_stage(writer.convert_string_to_html_string(
                        "In case, you feel not concentrated enough, take a short break.\n\n" +
                        "Press [Enter] to go on. "));
                };



            }


        }

    }
};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);