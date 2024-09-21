from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import AIMessage,HumanMessage, SystemMessage

def createJson(scrappedData):
    load_dotenv()
    model = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", google_api_key="AIzaSyCkdJgG4UcoiKMcM9SJ7xogP-eqjb4SIig")
    chat = []
    chat.append(SystemMessage("You will be a part of a software that insure the existence of some data on a view of a web application, a screen shot will be taken, and processed by an OCR and the result will sent to you, your task is to find the required data and fill a json object based on it and the provided schema, the schema is : \{\"Order_Id\":\"GET_ORDER_ID_FROM_THE_PROVIDED_OCR_DATA\",\"Amount\":\"GET_AMOUNT_FROM_THE_PROVIDED_OCR_DATA\"}, your output must be only a json object (from the previous scheme)  as a string, filled with the required data"))
    chat.append(HumanMessage(scrappedData))
    print('Promote Invoking...')
    result = model.invoke(chat)
    print('Promote Result : ', result.content)
    return result.content