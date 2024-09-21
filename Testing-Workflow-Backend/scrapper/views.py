from decimal import Decimal
import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import AIMessage,HumanMessage, SystemMessage

from scrapper.models import Test, TestStep1, TestStep2, TestStep3, TestStep4

def index(request):
    return HttpResponse("Hello, world. You're at the scrapper index.")


################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################
# NOTES FOR ANY ONE TRYING TO USE THIS PROJECT, IT IS NOT SAVE, IT IS JUST FOR DEMO PURPOSES, CONSIDER THIS SECURITY NOTE WHILE TRYING TO REBUILD IT : Disabling CSRF protection is not recommended in production unless you fully understand the risks. For production environments, it's better to manage CSRF tokens properly or limit exemptions only to endpoints that are necessary.

@csrf_exempt
def sendHtml(request):
    if request.method == 'POST':
        body_content = request.body.decode('utf-8')
        result = createJson(body_content)
        print(result)
        return HttpResponse(result, content_type='text/html')
    else:
        return HttpResponse("Only POST requests are allowed.", status=405)

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

####################################################################################################################################################################################


@csrf_exempt
def getStartPageDataAndStatus(request):
    if request.method == 'POST':
        body_content = request.body.decode('utf-8')
        result = createJson(body_content)
        print(result)
        return HttpResponse(result, content_type='text/html')
    else:
        return HttpResponse("Only POST requests are allowed.", status=405)


@csrf_exempt
def createNewTest(request):
    if request.method == 'POST':
        try:
            # Parse the request body as JSON
            body_content = json.loads(request.body.decode('utf-8'))

            # Extract values from the request body
            payment_service_logo_exists = body_content.get('payment_service_logo_exists')
            captcha_exists = body_content.get('captcha_exists')
            agree_on_terms_exists = body_content.get('agree_on_terms_exists')
            ocr_result = body_content.get('ocr_result')

            # Call createTest function to create the Test and return the ID
            test_id = createTest(payment_service_logo_exists, captcha_exists, agree_on_terms_exists, ocr_result)

            # Return a success response with the created test ID
            return JsonResponse({'test_id': test_id}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    # If the request is not POST, return method not allowed
    return HttpResponse("Only POST requests are allowed.", status=405)

def createTest(payment_service_logo_exists, captcha_exists, agree_on_terms_exists, ocr_result):
    # For demonstration, we'll assume OCR returns the amount as part of the result
    # Example: ocr_result = {'amount': '150.00'}
    # amount = ocr_result.get('amount', '0.00')

    jsonObject = createJson(ocr_result)
    print('jsonObject : ' , jsonObject)
    dataObject = json.loads(jsonObject)
    print('dataObject : ' , dataObject)
    amount = dataObject.get('Amount', '0.00')
    print('amount : ' , amount)
    # Create TestStep1 object
    step1 = TestStep1.objects.create(
        payment_service_logo_exists=payment_service_logo_exists,
        captcha_exists=captcha_exists,
        agree_on_terms_exists=agree_on_terms_exists,
        amount_displayed=amount
    )
    print('step1 : ' , step1)


    # Create Test object, you can link to other steps if needed
    new_test = Test.objects.create(step1=step1)

    # Return the created Test ID
    return new_test.id


@csrf_exempt
def checkAmount(request):
    if request.method == 'GET':
        sentAmount = request.GET.get('sentAmount')
        testId = request.GET.get('testId')

        test = Test.objects.get(id=testId)

        test.step3 = TestStep3.objects.create(
            sent_amount= Decimal(sentAmount),
        )

        test.save()

        print('test : ', test)
        print('amount : ', int(sentAmount))

        if(test.step1.amount_displayed == int(sentAmount)):
            return HttpResponse('true', status=200)
        else:
            return HttpResponse('false', status=200)

    # If the request is not POST, return method not allowed
    return HttpResponse("Only POST requests are allowed.", status=405)


@csrf_exempt
def testCard(request):
    if request.method == 'POST':
        try:
            # Parse the request body as JSON
            body_content = json.loads(request.body.decode('utf-8'))
            
            # Get query parameter 'testId'
            test_id = request.GET.get('testId')
            
            if not test_id:
                return JsonResponse({'error': 'testId query parameter is required'}, status=400)

            # Create a TestStep2 object from the request body
            step2 = createTestCard(body_content.get('number'), body_content.get('cvv2'), body_content.get('expiration_date'), body_content.get('password'), body_content.get('status'))
            
            # Fetch the Test object by ID
            test = Test.objects.get(id=test_id)
            
            # Assign step2 to test.step2 and save
            test.step2 = step2
            test.save()

            return JsonResponse({'message': 'Test step2 updated successfully'}, status=204)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Test.DoesNotExist:
            return JsonResponse({'error': 'Test not found'}, status=404)

    # If the request is not POST, return method not allowed
    return HttpResponse("Only POST requests are allowed.", status=405)


def createTestCard(number, cvv2, expiration_date, password, status):

    print('number : ' + number)
    step2 = TestStep2.objects.create(
        card_number= number,
        card_cvv2=cvv2,
        card_expiration_date=expiration_date,
        card_password=password,
        card_status=status
    )

    return step2


@csrf_exempt
def step4Test(request):
    if request.method == 'POST':
        try:

            body_content = json.loads(request.body.decode('utf-8'))
            
            test_id = request.GET.get('testId')
            
            if not test_id:
                return JsonResponse({'error': 'testId query parameter is required'}, status=400)

            step4 = createStep4(body_content.get('amount'), body_content.get('result'))
            
            # Fetch the Test object by ID
            test = Test.objects.get(id=test_id)
            
            # Assign step2 to test.step2 and save
            test.step4 = step4
            test.save()

            return JsonResponse({'message': 'Test step2 updated successfully'}, status=204)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Test.DoesNotExist:
            return JsonResponse({'error': 'Test not found'}, status=404)

    # If the request is not POST, return method not allowed
    return HttpResponse("Only POST requests are allowed.", status=405)


def createStep4(amount, result):
    step4 = TestStep4.objects.create(
        shown_amount=amount, 
        shown_result=result
    )

    return step4
