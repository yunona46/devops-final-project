output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.nodejs_server.id
}

output "instance_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.nodejs_server.public_ip
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.nodejs_sg.id
}
