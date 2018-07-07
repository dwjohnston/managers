import EvalTextArea from "./EvalTextArea";
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import sinon from "sinon";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<EvalTextArea />, div);
    ReactDOM.unmountComponentAtNode(div);
});


it('errors on submission, when json is bad', () => {

    const onChange = jest.fn();

    const component = shallow(<EvalTextArea onChange = {onChange} />);

    component.find('textarea').simulate("change", {
        target: {
            value: "aaa"
        }
    });

    component.find('form').simulate("submit", {
        preventDefault: jest.fn()
    }); 

    expect(component.state().error).not.toBeNull();
    expect(onChange.mock.calls.length).toBe(0);
});



it('returns the data  when json is good', () => {

    const onChange = jest.fn();
    const component = shallow(<EvalTextArea onSubmit = {onChange} />);
    const str = '{"result":true, "count":42}' ;

    component.find('textarea').simulate("change", {
        target: {
            value: str
        }
    });

    component.find('form').simulate("submit", {
        preventDefault: jest.fn()
    }); 


    expect(component.state().error).toBeNull();
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toEqual({"result": true, "count": 42}); 
});



