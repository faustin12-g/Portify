from rest_framework import serializers
from .models import AboutMe, Project, Experience, Education, Skill, SocialMedia, ContactInfo, ContactMessage


class AboutMeSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)
    logo_image = serializers.FileField(required=False, allow_null=True)
    cv_file = serializers.FileField(required=False, allow_null=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # User is read-only, set automatically
    
    class Meta:
        model = AboutMe
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def to_internal_value(self, data):
        # Remove user field if present (prevent frontend injection)
        # For QueryDict (from FormData), make it mutable and remove user field
        if hasattr(data, '_mutable'):
            if not data._mutable:
                data = data.copy()  # This makes it mutable
            # Remove user field from QueryDict
            if 'user' in data:
                data.pop('user')
        elif isinstance(data, dict):
            # For regular dict, create a copy and modify
            data = dict(data)
            data.pop('user', None)
            # Convert null/empty string to None for file fields to allow clearing
            for field in ['logo_image', 'profile_image', 'cv_file']:
                if field in data and (data[field] is None or data[field] == ''):
                    data[field] = None
            # Handle clients field - empty string should be None
            if 'clients' in data and (data['clients'] == '' or data['clients'] is None):
                data['clients'] = None
        
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        # User is set automatically in perform_create via serializer.save(user=request.user)
        # When user is passed from perform_create, it will be in validated_data via kwargs
        # We only remove it if it wasn't explicitly passed (i.e., from frontend)
        # Since to_internal_value already removes it from initial data, if it's here,
        # it came from perform_create, so we keep it
        # Actually, let's be safe and always allow user if it's in validated_data
        # (it means it came from perform_create via serializer.save(user=...))
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Ensure user cannot be changed
        validated_data.pop('user', None)
        
        # Handle clearing file fields (when None is explicitly passed)
        if 'logo_image' in validated_data and validated_data['logo_image'] is None:
            if instance.logo_image:
                instance.logo_image.delete(save=False)
            validated_data['logo_image'] = None
        
        if 'profile_image' in validated_data and validated_data['profile_image'] is None:
            if instance.profile_image:
                instance.profile_image.delete(save=False)
            validated_data['profile_image'] = None
        
        if 'cv_file' in validated_data and validated_data['cv_file'] is None:
            if instance.cv_file:
                instance.cv_file.delete(save=False)
            validated_data['cv_file'] = None
        
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            # Handle profile image
            if representation.get('profile_image'):
                image_path = representation['profile_image']
                if not image_path.startswith('http'):
                    if not image_path.startswith('/'):
                        image_path = f'/media/{image_path}'
                    representation['profile_image'] = request.build_absolute_uri(image_path)
            
            # Handle logo image
            if representation.get('logo_image'):
                logo_path = representation['logo_image']
                if not logo_path.startswith('http'):
                    if not logo_path.startswith('/'):
                        logo_path = f'/media/{logo_path}'
                    representation['logo_image'] = request.build_absolute_uri(logo_path)
            
            # Handle CV file
            if representation.get('cv_file'):
                cv_path = representation['cv_file']
                if not cv_path.startswith('http'):
                    if not cv_path.startswith('/'):
                        cv_path = f'/media/{cv_path}'
                    representation['cv_file'] = request.build_absolute_uri(cv_path)
        return representation


class ProjectSerializer(serializers.ModelSerializer):
    project_image = serializers.ImageField(required=False, allow_null=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # User is read-only
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def to_internal_value(self, data):
        # Remove user field if present (prevent frontend injection)
        # For QueryDict (from FormData), make it mutable and remove user field
        if hasattr(data, '_mutable'):
            if not data._mutable:
                data = data.copy()  # This makes it mutable
            # Remove user field from QueryDict
            if 'user' in data:
                data.pop('user')
        elif isinstance(data, dict):
            # For regular dict, create a copy and modify
            data = dict(data)
            data.pop('user', None)
        
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        # User will be set in perform_create via serializer.save(user=request.user)
        # When serializer.save(user=...) is called, user is merged into validated_data
        # We don't remove it here because it came from perform_create, not frontend
        # Frontend injection is prevented in to_internal_value
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get('project_image'):
            request = self.context.get('request')
            if request:
                image_path = representation['project_image']
                if not image_path.startswith('http'):
                    if not image_path.startswith('/'):
                        image_path = f'/media/{image_path}'
                    representation['project_image'] = request.build_absolute_uri(image_path)
        return representation


class ExperienceSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # User is read-only
    
    class Meta:
        model = Experience
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def to_internal_value(self, data):
        # Remove user field if present (prevent frontend injection)
        # For QueryDict (from FormData), make it mutable and remove user field
        if hasattr(data, '_mutable'):
            if not data._mutable:
                data = data.copy()  # This makes it mutable
            # Remove user field from QueryDict
            if 'user' in data:
                data.pop('user')
        elif isinstance(data, dict):
            # For regular dict, create a copy and modify
            data = dict(data)
            data.pop('user', None)
        
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        # User will be set in perform_create via serializer.save(user=request.user)
        # When serializer.save(user=...) is called, user is merged into validated_data
        # We don't remove it here because it came from perform_create, not frontend
        # Frontend injection is prevented in to_internal_value
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        return super().update(instance, validated_data)


class EducationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # User is read-only
    
    class Meta:
        model = Education
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def to_internal_value(self, data):
        # Remove user field if present (prevent frontend injection)
        # For QueryDict (from FormData), make it mutable and remove user field
        if hasattr(data, '_mutable'):
            if not data._mutable:
                data = data.copy()  # This makes it mutable
            # Remove user field from QueryDict
            if 'user' in data:
                data.pop('user')
        elif isinstance(data, dict):
            # For regular dict, create a copy and modify
            data = dict(data)
            data.pop('user', None)
        
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        # User will be set in perform_create via serializer.save(user=request.user)
        # When serializer.save(user=...) is called, user is merged into validated_data
        # We don't remove it here because it came from perform_create, not frontend
        # Frontend injection is prevented in to_internal_value
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        return super().update(instance, validated_data)


class SkillSerializer(serializers.ModelSerializer):
    icon_image = serializers.ImageField(required=False, allow_null=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # User is read-only
    
    class Meta:
        model = Skill
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def to_internal_value(self, data):
        # Remove user field if present (prevent frontend injection)
        # For QueryDict (from FormData), make it mutable and remove user field
        if hasattr(data, '_mutable'):
            if not data._mutable:
                data = data.copy()  # This makes it mutable
            # Remove user field from QueryDict
            if 'user' in data:
                data.pop('user')
        elif isinstance(data, dict):
            # For regular dict, create a copy and modify
            data = dict(data)
            data.pop('user', None)
        
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        # User will be set in perform_create via serializer.save(user=request.user)
        # When serializer.save(user=...) is called, user is merged into validated_data
        # We don't remove it here because it came from perform_create, not frontend
        # Frontend injection is prevented in to_internal_value
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get('icon_image'):
            request = self.context.get('request')
            if request:
                image_path = representation['icon_image']
                if not image_path.startswith('http'):
                    if not image_path.startswith('/'):
                        image_path = f'/media/{image_path}'
                    representation['icon_image'] = request.build_absolute_uri(image_path)
        return representation


class SocialMediaSerializer(serializers.ModelSerializer):
    icon_image = serializers.ImageField(required=False, allow_null=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # User is read-only
    
    class Meta:
        model = SocialMedia
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def to_internal_value(self, data):
        # Remove user field if present (prevent frontend injection)
        # For QueryDict (from FormData), make it mutable and remove user field
        if hasattr(data, '_mutable'):
            if not data._mutable:
                data = data.copy()  # This makes it mutable
            # Remove user field from QueryDict
            if 'user' in data:
                data.pop('user')
        elif isinstance(data, dict):
            # For regular dict, create a copy and modify
            data = dict(data)
            data.pop('user', None)
        
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        # User will be set in perform_create via serializer.save(user=request.user)
        # When serializer.save(user=...) is called, user is merged into validated_data
        # We don't remove it here because it came from perform_create, not frontend
        # Frontend injection is prevented in to_internal_value
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get('icon_image'):
            request = self.context.get('request')
            if request:
                image_path = representation['icon_image']
                if not image_path.startswith('http'):
                    if not image_path.startswith('/'):
                        image_path = f'/media/{image_path}'
                    representation['icon_image'] = request.build_absolute_uri(image_path)
        return representation


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # User is read-only
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'replied_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Include user details for admin views
        if instance.user:
            representation['user'] = {
                'id': instance.user.id,
                'username': instance.user.username,
            }
        return representation
    
    def create(self, validated_data):
        # Always set status to 'new' when creating via API
        validated_data['status'] = 'new'
        return super().create(validated_data)


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating messages (public endpoint - no status/reply fields)"""
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']
    
    def create(self, validated_data):
        validated_data['status'] = 'new'
        # User will be set in the view
        return ContactMessage.objects.create(**validated_data)
