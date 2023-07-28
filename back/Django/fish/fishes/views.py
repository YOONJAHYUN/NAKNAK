from django.shortcuts import render
from rest_framework.response import Response

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .inference.object_size import get_fish_length
from .inference.inference import get_fish_name


# Create your views here.

@api_view(['POST'])
def fishes(request):
    file_path = request.data['file_path']

    # file_path = 'C:/Users/SSAFY/Desktop'
    # fish_len = get_fish_length(file_path )

    # 물고기 종 판별
    fish_name = get_fish_name(file_path)

    # 물고기 size 측정
    fish_size = get_fish_length(file_path)

    print(fish_size)

    data = {
        'name': fish_name,
        'size': fish_size
    }

    return Response(data)
